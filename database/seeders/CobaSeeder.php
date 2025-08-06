<?php

namespace Database\Seeders;

use App\Models\CompetitionStage;
use App\Models\ParticipantProgress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CobaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
                // Ambil tahap pertama
        $registrasiStage = CompetitionStage::where('name', 'Registrasi Awal')->first();

        // Tambah progress untuk registrasi awal (sudah di-approve)
        ParticipantProgress::create([
            'participant_id' => 1,
            'competition_stage_id' => $registrasiStage->id,
            'status' => 'in_progress',

        ]);
    }
}
