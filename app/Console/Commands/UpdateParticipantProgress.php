<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ParticipantProgress;
use App\Models\CompetitionStage;
use Carbon\Carbon;

class UpdateParticipantProgress extends Command
{
    protected $signature = 'progress:update';
    protected $description = 'Automatically update participant progress status based on stage dates';

    public function handle()
    {
        
        $now = Carbon::now();
        $updatedCount = 0;
        $rejectedCount = 0;
        
        // Get active stages (where current date is between start and end date)
        $activeStages = CompetitionStage::where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->get();
            
            
        foreach ($activeStages as $stage) {
            // Update progresses that are still 'not_started' to 'in_progress'
            $updated = ParticipantProgress::where('competition_stage_id', $stage->id)
                ->where('status', 'not_started')
                ->update(['status' => 'in_progress']);
                
            $updatedCount += $updated;
            
                
            // You can also add logic for expired stages here
        }
        
        // Handle stages that have passed their end date
        $expiredStages = CompetitionStage::where('end_date', '<', $now)->get();
        
        
        
        foreach ($expiredStages as $stage) {
            // Update progresses that are still 'in_progress' to 'rejected' if not submitted
            $rejected = ParticipantProgress::where('competition_stage_id', $stage->id)
                ->where('status', 'in_progress')
                ->update(['status' => 'rejected']);
                
            $rejectedCount += $rejected;
            
        }
        
        $message = "Participant progress statuses updated successfully. Updated: {$updatedCount}, Rejected: {$rejectedCount}";
        $this->info($message);
        
    }
}