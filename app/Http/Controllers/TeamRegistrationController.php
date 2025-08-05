<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\CompetitionStage;
use App\Models\TeamRegistration;
use App\Models\ParticipantProgress;

class TeamRegistrationController extends Controller
{
    public function create()
    {
        return view('team-registration.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'leader_name' => 'required|string|max:255',
            'leader_nim' => 'required|string|max:255',
            'member1_name' => 'nullable|string|max:255',
            'member1_nim' => 'nullable|string|max:255',
            'member2_name' => 'nullable|string|max:255',
            'member2_nim' => 'nullable|string|max:255',
            'member3_name' => 'nullable|string|max:255',
            'member3_nim' => 'nullable|string|max:255',
            'ktm_scan_link' => 'required|url',
            'formal_photo_link' => 'required|url',
            'twibbon_link' => 'required|url',
            'ig_account_link' => 'required|url',
            'email' => 'required|email',
            'ppt_link' => 'nullable|url',
            'image_link' => 'nullable|url',
        ]);

        TeamRegistrationController::create($validated);

        return redirect()->route('registration.success');
    }
    
    public function index(Request $request)
    {
        $search = $request->query('search');
        $stageStatus = $request->query('progress_status', 'all');

        // Ambil ID stage 'Registrasi Awal' (order = 1)
        $registrasiStage = \App\Models\CompetitionStage::where('order', 1)->firstOrFail();

        // Base query: ambil peserta yang punya progress di tahap Registrasi Awal
        $query = \App\Models\TeamRegistration::whereHas('progress', function ($q) use ($registrasiStage) {
            $q->where('competition_stage_id', $registrasiStage->id);
        })
            ->with(['progress' => function ($q) use ($registrasiStage) {
                $q->where('competition_stage_id', $registrasiStage->id)->with('stage');
            }])
            ->orderBy('created_at', 'desc');

        // Filter pencarian
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('leader_name', 'like', "%{$search}%")
                    ->orWhere('leader_nim', 'like', "%{$search}%")
                    ->orWhere('leader_email', 'like', "%{$search}%")
                    ->orWhere('member1_name', 'like', "%{$search}%")
                    ->orWhere('member2_name', 'like', "%{$search}%")
                    ->orWhere('member3_name', 'like', "%{$search}%");
            });
        }

        // Filter berdasarkan status progress untuk stage Registrasi Awal
        if ($stageStatus !== 'all') {
            $query->whereHas('progress', function ($q) use ($stageStatus, $registrasiStage) {
                $q->where('competition_stage_id', $registrasiStage->id)
                    ->where('status', $stageStatus);
            });
        }

        $teams = $query->paginate(8);

        // Stats untuk stage Registrasi Awal saja
        $stats = [
            'total' => \App\Models\ParticipantProgress::where('competition_stage_id', $registrasiStage->id)->count(),
            'approved' => \App\Models\ParticipantProgress::where('competition_stage_id', $registrasiStage->id)->where('status', 'approved')->count(),
            'pending' => \App\Models\ParticipantProgress::where('competition_stage_id', $registrasiStage->id)->where('status', 'submitted')->count(),
            'not_started' => \App\Models\ParticipantProgress::where('competition_stage_id', $registrasiStage->id)->where('status', 'not_started')->count(),
        ];

        return Inertia::render('admin/team-management', [
            'teams' => $teams,
            'filters' => [
                'search' => $search,
                'progress_status' => $stageStatus,
            ],
            'stats' => $stats,
            'stage' => 'Registrasi Awal',
        ]);
    }


    public function updateStatus(TeamRegistration $team, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        // Update status tim
        $team->update(['status' => $request->status]);

        if ($request->status === 'approved') {

            // Ambil progress terakhir berdasarkan urutan tahap terbesar
            $latestProgress = $team->progress()->with('stage')
                ->get()
                ->sortByDesc(fn($progress) => $progress->stage->order)
                ->first();

            // Jika belum ada progress sama sekali, mulai dari Registrasi Awal
            if (!$latestProgress) {
                $registrasiStage = CompetitionStage::where('order', 1)->first();

                $latestProgress = ParticipantProgress::create([
                    'participant_id' => $team->id,
                    'competition_stage_id' => $registrasiStage->id,
                    'status' => 'approved',
                    'approved_at' => now(),
                ]);
            } else {
                // Update progress yang sedang berlangsung (jika belum di-approve)
                if ($latestProgress->status !== 'approved') {
                    $latestProgress->update([
                        'status' => 'approved',
                        'approved_at' => now(),
                    ]);
                }
            }

            // Cari tahap berikutnya
            $currentOrder = $latestProgress->stage->order;
            $nextStage = CompetitionStage::where('order', $currentOrder + 1)->first();

            if ($nextStage) {
                // Cek apakah sudah punya progress untuk tahap berikut
                $exists = ParticipantProgress::where('participant_id', $team->id)
                    ->where('competition_stage_id', $nextStage->id)
                    ->exists();

                if (! $exists) {
                    ParticipantProgress::create([
                        'participant_id' => $team->id,
                        'competition_stage_id' => $nextStage->id,
                        'status' => 'not_started',
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Status tim dan progress berhasil diperbarui.');
    }
}
