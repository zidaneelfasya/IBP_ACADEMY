<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PreliminaryParticipantController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $stageStatus = $request->query('progress_status', 'all');

        // Ambil ID stage 'Registrasi Awal' (order = 1)
        $registrasiStage = \App\Models\CompetitionStage::where('order', 2)->firstOrFail();

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

        return Inertia::render('admin/Preliminary', [
            'teams' => $teams,
            'filters' => [
                'search' => $search,
                'progress_status' => $stageStatus,
            ],
            'stats' => $stats,
            'stage' => 'Registrasi Awal',
        ]);
    }
   
}
