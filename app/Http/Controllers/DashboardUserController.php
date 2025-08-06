<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CompetitionStage;
use App\Models\TeamRegistration;
use Illuminate\Support\Facades\Auth;
use App\Models\ParticipantProgress;
use Illuminate\Support\Facades\Log;


class DashboardUserController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Tambahkan pengecekan jika user belum login
        if (!$user) {
            return redirect()->route('login');
        }

        try {
            // Tambahkan eager loading untuk competitionCategory
            $team = TeamRegistration::with(['competitionCategory', 'progress.stage'])
                ->where('user_id', $user->id)
                ->first();

            // Jika user belum memiliki tim
            if (!$team) {
                return Inertia::render('User/NoTeam', [
                    'bpcRoute' => route('competition.bpc.register.create'),
                    'bccRoute' => route('competition.bcc.register.create'),
                ]);
            }

            $stages = CompetitionStage::orderBy('order')->get();
            $currentDate = now();

           
            $processedStages = $stages->map(function ($stage) use ($currentDate) {
                $startDate = new \DateTime($stage->start_date);
                $endDate = new \DateTime($stage->end_date);
                $daysLeft = $currentDate->diff($endDate)->days;

                return [
                    ...$stage->toArray(),
                    'days_left' => $daysLeft,
                    'is_urgent' => $daysLeft <= 7 && $daysLeft >= 0,
                ];
            });

            return Inertia::render('User/Dashboard', [
                'stages' => $processedStages,
                'currentProgress' => $team->progress,
                'team' => [
                    'id' => $team->id,
                    'name' => $team->team_name,
                    'category_id' => $team->competition_category_id,
                    'category_name' => $team->competitionCategory ? $team->competitionCategory->name : 'Unknown Category'
                ],
                'urgentSubmissions' => $processedStages->filter(fn($stage) => $stage['is_urgent'])->values()
            ]);

        } catch (\Exception $e) {
            // Log error untuk debugging
            Log::error('Dashboard Error: ' . $e->getMessage());

            // Fallback view jika ada error
            return Inertia::render('Error', [
                'message' => 'Terjadi kesalahan saat memuat dashboard'
            ]);
        }
    }
}
