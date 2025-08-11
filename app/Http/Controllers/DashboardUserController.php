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

        if (!$user) {
            return redirect()->route('login');
        }

        try {
            $team = TeamRegistration::with(['competitionCategory', 'progress.stage'])
                ->where('user_id', $user->id)
                ->first();

            if (!$team) {
                return Inertia::render('User/NoTeam', [
                    'bpcRoute' => route('competition.bpc.register.create'),
                    'bccRoute' => route('competition.bcc.register.create'),
                ]);
            }

            $stages = CompetitionStage::orderBy('order')->get();
            $currentDate = now();

            // Get latest status for each stage with feedback
            $stageStatuses = [];
            $rejectedStages = [];
            $approvedStages = [];

            foreach ($team->progress as $progress) {
                $stageId = $progress->competition_stage_id;

                // Only keep the latest status for each stage
                if (!isset($stageStatuses[$stageId])) {
                    $stageStatuses[$stageId] = [
                        'status' => $progress->status,
                        'created_at' => $progress->created_at,
                        'feedback' => $progress->feedback
                    ];

                    if ($progress->status === 'rejected') {
                        $rejectedStages[$stageId] = [
                            'name' => $progress->stage->name,
                            'feedback' => $progress->feedback
                        ];
                    } elseif ($progress->status === 'approved') {
                        $approvedStages[$stageId] = [
                            'name' => $progress->stage->name,
                            'feedback' => $progress->feedback
                        ];
                    }
                }
            }

            // Determine current stage (first unapproved stage or last stage if all approved)
            $currentStage = $stages->first(function ($stage) use ($stageStatuses) {
                return !isset($stageStatuses[$stage->id]) ||
                       $stageStatuses[$stage->id]['status'] !== 'approved';
            }) ?? $stages->last();

            $processedStages = $stages->map(function ($stage) use ($currentDate, $stageStatuses, $currentStage) {
                $startDate = new \DateTime($stage->start_date);
                $endDate = new \DateTime($stage->end_date);
                $daysLeft = $currentDate > $endDate ? 0 : $currentDate->diff($endDate)->days;

                return [
                    ...$stage->toArray(),
                    'days_left' => $daysLeft,
                    'is_urgent' => $daysLeft <= 7 && $daysLeft >= 0,
                    'status' => $stageStatuses[$stage->id]['status'] ?? 'not_started',
                    'is_current' => $stage->id === $currentStage->id
                ];
            });

            // WhatsApp group links by stage (updated with correct links)
            $whatsappGroups = [
                1 => [ // Registration stage
                    'bpc' => 'https://chat.whatsapp.com/FIyeNmB7LIR6tJc3IGJmk5',
                    'bcc' => 'https://chat.whatsapp.com/FjxPVlMWAqW1nqdHZtEJcs'
                ],
                2 => [ // Preliminary round
                    'bpc' => 'https://chat.whatsapp.com/EXAMPLE_BPC_LINK_2',
                    'bcc' => 'https://chat.whatsapp.com/EXAMPLE_BCC_LINK_2'
                ],
                3 => [ // Final round
                    'bpc' => 'https://chat.whatsapp.com/EXAMPLE_BPC_LINK_3',
                    'bcc' => 'https://chat.whatsapp.com/EXAMPLE_BCC_LINK_3'
                ],
                4 => [ // Grand Final round
                    'bpc' => 'https://chat.whatsapp.com/EXAMPLE_BPC_LINK_4',
                    'bcc' => 'https://chat.whatsapp.com/EXAMPLE_BCC_LINK_4'
                ],
            ];

            return Inertia::render('User/Dashboard', [
                'stages' => $processedStages,
                'currentProgress' => $team->progress,
                'team' => [
                    'id' => $team->id,
                    'name' => $team->team_name,
                    'category_id' => $team->competition_category_id,
                    'category_name' => $team->competitionCategory?->name ?? 'Unknown Category',
                    'rejected_stages' => $rejectedStages,
                    'approved_stages' => $approvedStages,
                    'current_stage_id' => $currentStage->id
                ],
                'urgentSubmissions' => $processedStages->filter(fn($stage) => $stage['is_urgent'])->values(),
                'whatsapp_groups' => $whatsappGroups
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard Error: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'An error occurred while loading the dashboard'
            ]);
        }
    }
}
