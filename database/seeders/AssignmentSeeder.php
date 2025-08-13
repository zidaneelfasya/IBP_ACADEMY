<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\CompetitionStage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Faker\Factory as Faker;

class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get admin users who can create assignments
        $admins = User::where('role', 'admin')->get();
        if ($admins->isEmpty()) {
            $this->command->error('No admin users found. Please run UserSeeder first.');
            return;
        }

        // Get all competition stages
        $stages = CompetitionStage::orderBy('order')->get();
        if ($stages->isEmpty()) {
            $this->command->error('No competition stages found. Please run TestSeeder first.');
            return;
        }

        $assignments = [
            // Registration Stage Assignments
            [
                'stage_name' => 'Registration',
                'assignments' => [
                    [
                        'title' => 'Validasi Berkas Pendaftaran',
                        'description' => 'Tim harus melengkapi dan mengunggah semua berkas pendaftaran yang diperlukan termasuk surat pernyataan, kartu mahasiswa, dan pas foto.',
                        'instructions' => 'Upload semua berkas dalam format PDF dengan nama file: [Nama_Tim]_[Jenis_Berkas]. Pastikan semua dokumen terbaca dengan jelas.',
                        'deadline_days_from_start' => 7,
                    ],
                ]
            ],
            
            // Preliminary Round Assignments
            [
                'stage_name' => 'Preliminary Round',
                'assignments' => [
                    [
                        'title' => 'Proposal Inovasi Teknologi',
                        'description' => 'Menyusun proposal inovasi teknologi yang dapat menyelesaikan permasalahan di bidang teknologi informasi dengan pendekatan kreatif dan implementatif.',
                        'instructions' => 'Proposal maksimal 15 halaman, format PDF, mencakup: latar belakang, rumusan masalah, solusi, metodologi, timeline implementasi, dan dampak yang diharapkan. Font Times New Roman 12pt, spasi 1.5.',
                        'deadline_days_from_start' => 10,
                    ],
                    [
                        'title' => 'Video Pitch Ide',
                        'description' => 'Membuat video presentasi singkat tentang ide inovasi yang diajukan dalam proposal.',
                        'instructions' => 'Video berdurasi maksimal 5 menit, format MP4, resolusi minimal 720p. Upload ke YouTube/Google Drive dan sertakan link. Video harus mencakup penjelasan masalah, solusi, dan keunikan ide.',
                        'deadline_days_from_start' => 12,
                    ],
                ]
            ],
            
            // Semifinal Round Assignments
            [
                'stage_name' => 'Semifinal Round',
                'assignments' => [
                    [
                        'title' => 'Prototype Development',
                        'description' => 'Mengembangkan prototype atau minimum viable product (MVP) dari ide yang telah diajukan pada tahap sebelumnya.',
                        'instructions' => 'Submit link GitHub repository atau demo aplikasi. Sertakan dokumentasi teknis, panduan instalasi, dan video demo fungsi utama (maks 10 menit).',
                        'deadline_days_from_start' => 14,
                    ],
                    [
                        'title' => 'Business Model Canvas',
                        'description' => 'Menyusun model bisnis yang komprehensif untuk implementasi ide dalam skala komersial.',
                        'instructions' => 'Format canvas standar dalam 1 halaman A3 atau 2 halaman A4. Sertakan analisis SWOT dan proyeksi finansial sederhana untuk 2 tahun ke depan.',
                        'deadline_days_from_start' => 11,
                    ],
                    [
                        'title' => 'Technical Documentation',
                        'description' => 'Dokumentasi teknis lengkap dari prototype yang dikembangkan.',
                        'instructions' => 'Dokumentasi harus mencakup: arsitektur sistem, teknologi yang digunakan, API documentation (jika ada), user manual, dan troubleshooting guide. Format PDF maksimal 20 halaman.',
                        'deadline_days_from_start' => 13,
                    ],
                ]
            ],
            
            // Final Round Assignments
            [
                'stage_name' => 'Final Round',
                'assignments' => [
                    [
                        'title' => 'Final Presentation Deck',
                        'description' => 'Menyiapkan materi presentasi final yang akan dipresentasikan di hadapan juri.',
                        'instructions' => 'Slide presentasi maksimal 20 slide, format PowerPoint/PDF. Durasi presentasi 15 menit + 10 menit Q&A. Fokus pada solusi, implementasi, dan dampak.',
                        'deadline_days_from_start' => 5,
                    ],
                    [
                        'title' => 'Product Demo Video',
                        'description' => 'Video demonstrasi lengkap produk yang telah dikembangkan dengan skenario penggunaan nyata.',
                        'instructions' => 'Video berdurasi 10-15 menit, kualitas HD, narator yang jelas. Tunjukkan fitur utama, user journey, dan keunggulan produk. Upload ke platform video dan sertakan link.',
                        'deadline_days_from_start' => 7,
                    ],
                    [
                        'title' => 'Implementation Roadmap',
                        'description' => 'Rencana implementasi dan pengembangan produk jangka panjang.',
                        'instructions' => 'Dokumen roadmap 5-10 halaman mencakup: tahapan pengembangan, strategi go-to-market, analisis kompetitor, dan sustainability plan. Format PDF.',
                        'deadline_days_from_start' => 3,
                    ],
                ]
            ],
        ];

        foreach ($assignments as $stageData) {
            $stage = $stages->firstWhere('name', $stageData['stage_name']);
            
            if (!$stage) {
                $this->command->warn("Stage '{$stageData['stage_name']}' not found, skipping...");
                continue;
            }

            foreach ($stageData['assignments'] as $assignmentData) {
                // Calculate deadline based on stage start date
                $deadline = $stage->start_date 
                    ? Carbon::parse($stage->start_date)->addDays($assignmentData['deadline_days_from_start'])
                    : Carbon::now()->addDays($assignmentData['deadline_days_from_start']);

                Assignment::create([
                    'competition_stage_id' => $stage->id,
                    'title' => $assignmentData['title'],
                    'description' => $assignmentData['description'],
                    'instructions' => $assignmentData['instructions'],
                    'deadline' => $deadline,
                    'is_active' => true,
                    'created_by' => $admins->random()->id,
                ]);

                $this->command->info("Created assignment: {$assignmentData['title']} for stage: {$stage->name}");
            }
        }

        $this->command->info('Assignment seeder completed successfully!');
    }
}
