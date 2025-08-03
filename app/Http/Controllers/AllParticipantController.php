<?php

namespace App\Http\Controllers;

use App\Models\ParticipantProgress;
use App\Models\TeamRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllParticipantController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $stageStatus = $request->query('progress_status', 'all');

        // Base query
        $query = TeamRegistration::with(['progress.stage']) // eager load progress & stage
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

        // Optional: filter by last progress status
        if ($stageStatus !== 'all') {
            $query->whereHas('progress', function ($q) use ($stageStatus) {
                $q->where('status', $stageStatus);
            });
        }

        $teams = $query->paginate(8);

        // Stats by progress status
        $stats = [
            'total' => TeamRegistration::count(),
            'approved' => ParticipantProgress::where('status', 'approved')->count(),
            'pending' => ParticipantProgress::where('status', 'submitted')->count(),
            'not_started' => ParticipantProgress::where('status', 'not_started')->count(),
        ];

        return Inertia::render('admin/team-management', [
            'teams' => $teams,
            'filters' => [
                'search' => $search,
                'progress_status' => $stageStatus,
            ],
            'stats' => $stats,
        ]);
    }
}
