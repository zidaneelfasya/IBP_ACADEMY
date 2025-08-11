<?php

namespace Database\Seeders;

use App\Models\CompetitionStage;
use App\Models\ParticipantProgress;
use App\Models\TeamRegistration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

          CompetitionStage::insert([
            [
                'name' => 'Registration',
                'order' => 1,
                'start_date' => Carbon::create(2025, 8, 8, 0, 0, 0),
                'end_date' => Carbon::create(2025, 8, 21, 23, 59, 59),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Preliminary Round',
                'order' => 2,
                'start_date' => Carbon::create(2025, 8, 15, 0, 0, 0),
                'end_date' => Carbon::create(2025, 8, 31, 23, 59, 59),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Semifinal Round',
                'order' => 3,
                'start_date' => Carbon::create(2025, 9, 9, 0, 0, 0),
                'end_date' => Carbon::create(2025, 9, 23, 23, 59, 59),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Final Round',
                'order' => 4,
                'start_date' => Carbon::create(2025, 9, 30, 0, 0, 0),
                'end_date' => Carbon::create(2025, 10, 20, 23, 59, 59),
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);


        // $team = TeamRegistration::create([
        //     'tim_name' => 'Tim Inovator',
        //     'asal_universitas' => 'Universitas Teknologi Cerdas',
        //     'prodi_fakultas' => 'Teknik Industri / Fakultas Teknik',
        //     'leader_name' => 'Andi Wijaya',
        //     'leader_nim' => 'TI20210123',
        //     'leader_email' => 'andi.wijaya@email.com',
        //     'leader_phone' => '081234567890',
        //     'member1_name' => 'Budi Santoso',
        //     'member1_nim' => 'TI20210124',
        //     'member2_name' => 'Citra Lestari',
        //     'member2_nim' => 'TI20210125',
        //     'member3_name' => 'Dewi Pertiwi',
        //     'member3_nim' => 'TI20210126',
        //     'link_berkas' => 'https://example.com/berkas/registrasi.pdf',
        //     'status' => 'verified',
        //     'kategori_lomba' => 'BCC'
        // ]);


        // // Ambil tahap pertama
        // $registrasiStage = CompetitionStage::where('name', 'Registrasi Awal')->first();

        // // Tambah progress untuk registrasi awal (sudah di-approve)
        // ParticipantProgress::create([
        //     'participant_id' => $team->id,
        //     'competition_stage_id' => $registrasiStage->id,
        //     'status' => 'in_progress',

        // ]);



    }
}
