<?php

namespace App\Http\Controllers;

use App\Models\CompetitionCategory;
use App\Models\ParticipantProgress;
use App\Models\TeamRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinalParticipantController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $stageStatus = $request->query('progress_status', 'all');
        $categoryFilter = $request->query('category', 'all');

        // Base query with eager loading - mencari order = 2
        $query = TeamRegistration::with([
            'competitionCategory',
            'progress' => function ($query) {
                $query->whereHas('stage', function ($q) {
                    $q->where('order', 4); // Hanya ambil progress dengan order 2
                });
            },
            'progress.stage'
        ])
            ->whereHas('progress.stage', function ($q) {
                $q->where('order', 4); // Filter tim yang memiliki progress dengan order = 2
            })
            ->orderBy('created_at', 'desc');

        // Search filter (tetap sama)
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

        // Filter by progress status - untuk order 2
        if ($stageStatus !== 'all') {
            $query->whereHas('progress', function ($q) use ($stageStatus) {
                $q->where('status', $stageStatus)
                    ->whereHas('stage', function ($q2) {
                        $q2->where('order', 4); // Pastikan filter status hanya berlaku untuk order 2
                    });
            });
        }

        // Filter by category (tetap sama)
        if ($categoryFilter !== 'all') {
            $query->whereHas('competitionCategory', function ($q) use ($categoryFilter) {
                $q->where('name', $categoryFilter);
            });
        }

        $teams = $query->paginate(8);

        // Get active categories for filter dropdown (tetap sama)
        $categories = CompetitionCategory::active()->pluck('name');

        // Stats by progress status - hanya untuk order 2
        $stats = [
            'total' => TeamRegistration::whereHas('progress.stage', function ($q) {
                $q->where('order', 4);
            })->count(),
            'approved' => ParticipantProgress::whereHas('stage', function ($q) {
                $q->where('order', 4);
            })->where('status', 'approved')->count(),
            'pending' => ParticipantProgress::whereHas('stage', function ($q) {
                $q->where('order', 4);
            })->where('status', 'submitted')->count(),
            'not_started' => ParticipantProgress::whereHas('stage', function ($q) {
                $q->where('order', 4);
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
}
