<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ParticipantProgress;
use App\Models\TeamRegistration;
use App\Models\CompetitionStage;

class ParticipantProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get preliminary stage
        $preliminaryStage = CompetitionStage::where('name', 'LIKE', '%preliminary%')
            ->orWhere('name', 'LIKE', '%Preliminary%')
            ->first();

        if (!$preliminaryStage) {
            $this->command->error('Preliminary stage not found. Please run CompetitionStageSeeder first.');
            return;
        }

        // Get approved team registrations
        $approvedTeams = TeamRegistration::where('status', 'approved')->get();

        if ($approvedTeams->isEmpty()) {
            $this->command->info('No approved team registrations found. Creating sample progress for testing...');

            // Create a sample team registration for testing
            $sampleTeam = TeamRegistration::first();
            if ($sampleTeam) {
                $sampleTeam->update(['status' => 'approved']);
                $approvedTeams = collect([$sampleTeam]);
            } else {
                $this->command->error('No team registrations found at all.');
                return;
            }
        }

        foreach ($approvedTeams as $team) {
            // Create or update participant progress for preliminary stage
            ParticipantProgress::updateOrCreate(
                [
                    'participant_id' => $team->id,
                    'competition_stage_id' => $preliminaryStage->id,
                ],
                [
                    'status' => 'approved',
                    'notes' => 'Qualified for preliminary stage',
                    'submitted_at' => now(),
                    'approved_at' => now(),
                ]
            );
        }

        $this->command->info('ParticipantProgress seeder completed! ' . $approvedTeams->count() . ' teams qualified for preliminary stage.');
    }
}
