<?php

namespace App\Http\Controllers;

use App\Models\CompetitionCategory;
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
        $categoryFilter = $request->query('category', 'all');

        // Base query with eager loading
        $query = TeamRegistration::with([
            'competitionCategory',
            'progress' => function ($query) {
                $query->whereHas('stage', function ($q) {
                    $q->where('order', 1); // Hanya ambil progress dengan order 1
                });
            },
            'progress.stage'
        ])
            ->whereHas('progress.stage', function ($q) {
                $q->where('order', 1); // Filter tim yang memiliki progress dengan order = 1
            })
            ->orderBy('created_at', 'desc');

        // Search filter
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

        // Filter by progress status
        if ($stageStatus !== 'all') {
            $query->whereHas('progress', function ($q) use ($stageStatus) {
                $q->where('status', $stageStatus)
                    ->whereHas('stage', function ($q2) {
                        $q2->where('order', 1); // Pastikan filter status hanya berlaku untuk order 1
                    });
            });
        }

        // Filter by category
        if ($categoryFilter !== 'all') {
            $query->whereHas('competitionCategory', function ($q) use ($categoryFilter) {
                $q->where('name', $categoryFilter);
            });
        }

        $teams = $query->paginate(8);

        // Get active categories for filter dropdown
        $categories = CompetitionCategory::active()->pluck('name');

        // Stats by progress status - hanya untuk order 1
        $stats = [
            'total' => TeamRegistration::whereHas('progress.stage', function ($q) {
                $q->where('order', 1);
            })->count(),
            'approved' => ParticipantProgress::whereHas('stage', function ($q) {
                $q->where('order', 1);
            })->where('status', 'approved')->count(),
            'pending' => ParticipantProgress::whereHas('stage', function ($q) {
                $q->where('order', 1);
            })->where('status', 'submitted')->count(),
            'not_started' => ParticipantProgress::whereHas('stage', function ($q) {
                $q->where('order', 1);
            })->where('status', 'not_started')->count(),
        ];

        return Inertia::render('admin/team-management', [
            'teams' => $teams,
            'filters' => [
                'search' => $search,
                'progress_status' => $stageStatus,
                'category' => $categoryFilter,
            ],
            'stats' => $stats,
            'categories' => $categories,
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
    public function updateStatusReject(TeamRegistration $team, Request $request)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        // Update status tim
        $team->update(['status' => $request->status]);

        if ($request->status === 'rejected') {

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
                if ($latestProgress->status !== 'rejected') {
                    $latestProgress->update([
                        'status' => 'rejected',
                        'approved_at' => now(),
                    ]);
                }
            }

            // // Cari tahap berikutnya
            // $currentOrder = $latestProgress->stage->order;
            // $nextStage = CompetitionStage::where('order', $currentOrder + 1)->first();

            // if ($nextStage) {
            //     // Cek apakah sudah punya progress untuk tahap berikut
            //     $exists = ParticipantProgress::where('participant_id', $team->id)
            //         ->where('competition_stage_id', $nextStage->id)
            //         ->exists();

            //     if (! $exists) {
            //         ParticipantProgress::create([
            //             'participant_id' => $team->id,
            //             'competition_stage_id' => $nextStage->id,
            //             'status' => 'not_started',
            //         ]);
            //     }
            // }
        }

        return redirect()->back()->with('success', 'Status tim dan progress berhasil diperbarui.');
    }

    public function update(TeamRegistration $team, Request $request)
    {
        $validated = $request->validate([
            'tim_name' => 'required|string|max:255',
            'leader_name' => 'required|string|max:255',
            'leader_nim' => 'required|string|max:20',
            'leader_email' => 'required|email|max:255',
            'leader_phone' => 'required|string|max:20',
            'leader_univ' => 'required|string|max:255',
            'leader_fakultas' => 'required|string|max:255',
            'member1_name' => 'nullable|string|max:255',
            'member1_nim' => 'nullable|string|max:20',
            'member1_email' => 'nullable|email|max:255',
            'member1_phone' => 'nullable|string|max:20',
            'member1_univ' => 'nullable|string|max:255',
            'member1_fakultas' => 'nullable|string|max:255',
            'member2_name' => 'nullable|string|max:255',
            'member2_nim' => 'nullable|string|max:20',
            'member2_email' => 'nullable|email|max:255',
            'member2_phone' => 'nullable|string|max:20',
            'member2_univ' => 'nullable|string|max:255',
            'member2_fakultas' => 'nullable|string|max:255',
            'link_berkas' => 'required|url',
        ]);

        try {
            $team->update($validated);
            return redirect()->back()->with('success', 'Data tim berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui data tim: ' . $e->getMessage());
        }
    }

    public function destroy(TeamRegistration $team)
    {
        try {
            $team->delete();
            return redirect()->back()->with('success', 'Tim berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus tim: ' . $e->getMessage());
        }
    }
}
