<?php

namespace App\Http\Controllers;

use App\Models\TeamRegistration;
use App\Models\ParticipantProgress;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\CompetitionStage;



class ParticipantProfileController extends Controller
{
   public function show()
{
    $team = TeamRegistration::with(['competitionCategory', 'progress.stage'])
        ->where('user_id', auth()->id()) 
        ->firstOrFail();

    return Inertia::render('User/Profile', [
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
            'due_date' => $stage->due_date?->format('Y-m-d'),
            'status' => $progress?->status ?? 'not-started',
            'submitted_at' => $progress?->submitted_at?->format('Y-m-d H:i'),
            'approved_at' => $progress?->approved_at?->format('Y-m-d H:i'),
            'progress_percentage' => $stageProgress,
        ];
    })->toArray();
}
}
