<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ParticipantProgress;
use App\Models\CompetitionStage;
use Illuminate\Http\Request;

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
}
