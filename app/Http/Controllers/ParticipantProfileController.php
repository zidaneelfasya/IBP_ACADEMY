<?php

namespace App\Http\Controllers;

use App\Models\TeamRegistration;
use App\Models\ParticipantProgress;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\CompetitionStage;
use Illuminate\Support\Facades\Auth;



class ParticipantProfileController extends Controller
{
public function show()
    {
        $user = Auth::user();

        // Find team or return null if not exists
        $team = TeamRegistration::with(['competitionCategory', 'progress.stage'])
            ->where('user_id', $user->id)
            ->first();

        if (!$team) {
            return Inertia::render('User/Profile', [
                'hasTeam' => false,
                'competitionOptions' => [
                    [
                        'name' => 'Business Plan Competition (BPC)',
                        'route' => route('competition.bpc.register.create'),
                        'description' => 'Competition for innovative business ideas'
                    ],
                    [
                        'name' => 'Business Case Competition (BCC)',
                        'route' => route('competition.bcc.register.create'),
                        'description' => 'Competition for business case analysis'
                    ]
                ]
            ]);
        }

        return Inertia::render('User/Profile', [
            'hasTeam' => true,
            'team' => $this->formatTeamData($team),
            'stages' => $this->getStagesWithProgress($team),
        ]);
    }


    private function formatTeamData(TeamRegistration $team): array
    {
        return [
            'id' => $team->id,
            'tim_name' => $team->tim_name,
            'registration_number' => $team->registration_number,
            'asal_universitas' => $team->asal_universitas,
            'prodi_fakultas' => $team->prodi_fakultas,
            'competition_category' => $team->competitionCategory?->name,
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
            'member3_name' => $team->member3_name,
            'member3_nim' => $team->member3_nim,
            'member3_email' => $team->member3_email,
            'member3_phone' => $team->member3_phone,
            'link_berkas' => $team->link_berkas,
            'status' => $team->status,
            'admin_notes' => $team->admin_notes,
           'registered_at' => $team->registered_at ? Carbon::parse($team->registered_at)->format('Y-m-d H:i') : null,
            'reviewed_at' => $team->reviewed_at ? Carbon::parse($team->reviewed_at)->format('Y-m-d H:i') : null,
        ];
    }

   private function getStagesWithProgress(TeamRegistration $team): array
{
    $stages = CompetitionStage::orderBy('order')->get();
    $totalStages = $stages->count();
    $completedStages = 0;

    return $stages->map(function($stage) use ($team, $totalStages, &$completedStages) {
        $progress = $team->progress->firstWhere('competition_stage_id', $stage->id);

        if ($progress?->status === 'completed') {
            $completedStages++;
        }

        $stageProgress = $totalStages > 0 ? round(($completedStages / $totalStages) * 100) : 0;

        return [
            'id' => $stage->id,
            'name' => $stage->name,
            'description' => $stage->description,
            'due_date' => $stage->end_date,
            'start_date' => $stage->start_date,
            'end_date' => $stage->end_date,
            'status' => $progress?->status ?? 'not-started',
            'submitted_at' => $progress?->submitted_at,
            'approved_at' => $progress?->approved_at,
            'progress_percentage' => $stageProgress,
            'round_number' => $stage->order,
        ];
    })->toArray();
}
}
