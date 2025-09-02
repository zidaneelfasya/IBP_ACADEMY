<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ParticipantProgress;
use App\Models\CompetitionStage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ParticipantProgressController extends Controller
{
    public function approve(Request $request, ParticipantProgress $progress)
    {
        // Update status jadi approved
        $progress->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        // Cek apakah ada tahap berikutnya
        $nextStage = CompetitionStage::where('order', $progress->stage->order + 1)->first();

        if ($nextStage) {
            // Cek apakah peserta sudah punya progress untuk tahap ini
            $exists = ParticipantProgress::where('participant_id', $progress->participant_id)
                ->where('competition_stage_id', $nextStage->id)
                ->exists();

            if (! $exists) {
                ParticipantProgress::create([
                    'participant_id' => $progress->participant_id,
                    'competition_stage_id' => $nextStage->id,
                    'status' => 'not_started',
                ]);
            }
        }

        return response()->json([
            'message' => 'Tahap berhasil di-approve dan tahap selanjutnya dibuka.',
        ]);
    }

    /**
     * Update status of participant progress for a team
     */
    public function updateTeamStatus(Request $request, $teamId)
    {
        $request->validate([
            'status' => 'required|in:not_started,in_progress,submitted,approved,rejected',
        ]);

        try {
            // Cari progress terbaru berdasarkan stage order tertinggi
            $latestProgress = ParticipantProgress::where('participant_id', $teamId)
                ->join('competition_stages', 'participant_progress.competition_stage_id', '=', 'competition_stages.id')
                ->select('participant_progress.*', 'competition_stages.order as stage_order')
                ->orderBy('competition_stages.order', 'desc')
                ->first();

            if ($latestProgress) {
                // Update existing progress - find the actual progress record
                $progress = ParticipantProgress::find($latestProgress->id);

                if (!$progress) {
                    return response()->json([
                        'message' => 'Progress record not found'
                    ], 404);
                }

                $updateData = ['status' => $request->status];

                if ($request->status === 'approved') {
                    $updateData['approved_at'] = now();
                } else {
                    $updateData['approved_at'] = null;
                }

                $progress->update($updateData);

                // Jika status diubah ke approved, cek apakah ada tahap berikutnya
                if ($request->status === 'approved') {
                    $currentStage = CompetitionStage::find($progress->competition_stage_id);
                    if ($currentStage) {
                        $nextStage = CompetitionStage::where('order', $currentStage->order + 1)->first();

                        if ($nextStage) {
                            $exists = ParticipantProgress::where('participant_id', $teamId)
                                ->where('competition_stage_id', $nextStage->id)
                                ->exists();

                            if (!$exists) {
                                ParticipantProgress::create([
                                    'participant_id' => $teamId,
                                    'competition_stage_id' => $nextStage->id,
                                    'status' => 'not_started',
                                ]);
                            }
                        }
                    }
                }
            } else {
                // Create new progress for Registration stage
                $registrationStage = CompetitionStage::where('order', 1)->first();

                if (!$registrationStage) {
                    return response()->json([
                        'message' => 'Registration stage not found'
                    ], 404);
                }

                $updateData = [
                    'participant_id' => $teamId,
                    'competition_stage_id' => $registrationStage->id,
                    'status' => $request->status,
                ];

                if ($request->status === 'approved') {
                    $updateData['approved_at'] = now();
                }

                ParticipantProgress::create($updateData);
            }

            return back()->with('success', 'Status berhasil diperbarui');
        } catch (\Exception $e) {
            Log::error('Error updating team status: ' . $e->getMessage(), [
                'teamId' => $teamId,
                'status' => $request->status,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['status' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }
}
