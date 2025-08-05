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
                ->orWhere('member3_name', 'like', "%{$search}%");
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

    $teams = $query->paginate(8);

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
