<?php

namespace App\Http\Controllers;

use App\Models\CompetitionCategory;
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
    $categoryFilter = $request->query('category', 'all'); // New category filter

    // Base query with eager loading
    $query = TeamRegistration::with(['progress.stage', 'competitionCategory'])
        ->orderBy('created_at', 'desc');

    // Search filter
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('leader_name', 'like', "%{$search}%")
                ->orWhere('leader_nim', 'like', "%{$search}%")
                ->orWhere('leader_email', 'like', "%{$search}%")
                ->orWhere('member1_name', 'like', "%{$search}%")
                ->orWhere('member2_name', 'like', "%{$search}%")
                ->orWhere('tim_name', 'like', "%{$search}%");
        });
    }

    // Filter by progress status
    if ($stageStatus !== 'all') {
        $query->whereHas('progress', function ($q) use ($stageStatus) {
            $q->where('status', $stageStatus);
        });
    }

    // Filter by category
    if ($categoryFilter !== 'all') {
        $query->whereHas('competitionCategory', function ($q) use ($categoryFilter) {
            $q->where('name', $categoryFilter);
        });
    }

    $teams = $query->paginate(8)->through(function ($team) {
        // Map the database fields to match frontend expectations
        return [
            'id' => $team->id,
            'registration_number' => $team->registration_number,
            'tim_name' => $team->tim_name,
            'competition_category' => $team->competitionCategory ? [
                'id' => $team->competitionCategory->id,
                'name' => $team->competitionCategory->name,
            ] : null,
            'leader_name' => $team->leader_name,
            'leader_nim' => $team->leader_nim,
            'leader_email' => $team->leader_email,
            'leader_phone' => $team->leader_phone,
            'member1_name' => $team->member1_name,
            'member1_nim' => $team->member1_nim,
            'member1_email' => $team->member1_email,
            'member1_phone' => $team->member1_phone,
            'member2_name' => $team->member2_name,
            'member2_nim' => $team->member2_nim,
            'member2_email' => $team->member2_email,
            'member2_phone' => $team->member2_phone,
            'member3_name' => null, // Not in current schema
            'member3_nim' => null,  // Not in current schema
            'member3_email' => null, // Not in current schema
            'member3_phone' => null, // Not in current schema
            'asal_universitas' => $team->leader_univ, // Map leader_univ to asal_universitas
            'prodi_fakultas' => $team->leader_fakultas, // Map leader_fakultas to prodi_fakultas
            'link_berkas' => $team->link_berkas,
            'status' => $team->status,
            'registered_at' => $team->registered_at,
            'created_at' => $team->created_at,
            'updated_at' => $team->updated_at,
            'progress' => $team->progress->map(function ($progress) {
                return [
                    'id' => $progress->id,
                    'status' => $progress->status,
                    'stage' => [
                        'id' => $progress->stage->id,
                        'name' => $progress->stage->name,
                        'order' => $progress->stage->order,
                    ],
                    'approved_at' => $progress->approved_at,
                ];
            }),
        ];
    });

    // Get active categories for filter dropdown
    $categories = CompetitionCategory::active()->pluck('name');

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
            'category' => $categoryFilter, // Add category to filters
        ],
        'stats' => $stats,
        'categories' => $categories, // Pass categories to frontend
    ]);
}
}
