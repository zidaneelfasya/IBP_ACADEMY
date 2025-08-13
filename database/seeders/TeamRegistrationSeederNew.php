<?php

namespace Database\Seeders;

use App\Models\TeamRegistration;
use App\Models\CompetitionCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TeamRegistrationSeederNew extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get competition categories
        $categories = CompetitionCategory::where('is_active', true)->get();
        if ($categories->isEmpty()) {
            $this->command->error('No active competition categories found. Please run CompetitionCategoriesSeeder first.');
            return;
        }

        // Get users for user_id field
        $users = User::where('role', 'user')->get();
        if ($users->isEmpty()) {
            $this->command->error('No user role users found. Please run UserSeeder first.');
            return;
        }

        $universities = [
            'Institut Pertanian Bogor',
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Universitas Gadjah Mada',
            'Institut Teknologi Sepuluh Nopember',
            'Universitas Airlangga',
            'Universitas Diponegoro',
            'Universitas Hasanuddin',
            'Universitas Brawijaya',
            'Universitas Padjadjaran',
            'Universitas Sebelas Maret',
            'Universitas Andalas',
            'Universitas Sriwijaya',
            'Universitas Riau',
            'Universitas Lampung',
            'Universitas Jember',
            'Universitas Udayana',
            'Universitas Sam Ratulangi',
            'Universitas Tadulako',
            'Universitas Mulawarman'
        ];

        $faculties = [
            'Fakultas Teknik',
            'Fakultas Ilmu Komputer',
            'Fakultas MIPA',
            'Fakultas Ekonomi dan Bisnis',
            'Fakultas Teknologi Pertanian',
            'Fakultas Sains dan Teknologi',
            'Fakultas Teknik Informatika',
            'Fakultas Teknologi Informasi',
            'Fakultas Rekayasa Industri',
            'Fakultas Sains Data',
        ];

        $departments = [
            'Teknik Informatika',
            'Sistem Informasi',
            'Ilmu Komputer',
            'Teknik Komputer',
            'Sains Data',
            'Teknologi Informasi',
            'Rekayasa Perangkat Lunak',
            'Teknik Elektro',
            'Teknik Industri',
            'Matematika',
        ];

        $teamNames = [
            'Code Warriors', 'Tech Innovators', 'Digital Pioneers', 'Cyber Knights',
            'Data Wizards', 'Algorithm Masters', 'Innovation Squad', 'Tech Titans',
            'Binary Heroes', 'Future Builders', 'Smart Coders', 'Tech Revolution',
            'Digital Creators', 'Innovation Lab', 'Code Breakers', 'Tech Explorers',
            'Data Scientists', 'AI Researchers', 'Tech Visionaries', 'Digital Minds',
            'Code Architects', 'Tech Geniuses', 'Innovation Hub', 'Digital Alchemists',
            'Smart Solutions', 'Tech Pioneers', 'Code Ninjas', 'Digital Transformers',
            'Tech Mavericks', 'Innovation Engine', 'Code Crafters', 'Digital Dynasty',
            'Tech Innovate', 'Code Symphony', 'Digital Frontier', 'Tech Catalyst'
        ];

        // Create 25 team registrations
        for ($i = 0; $i < 25; $i++) {
            $category = $categories->random();
            $user = $users->random();
            $university = $faker->randomElement($universities);
            $faculty = $faker->randomElement($faculties);
            $department = $faker->randomElement($departments);
            
            // Generate unique team name
            $teamName = $faker->randomElement($teamNames) . ' ' . $faker->randomElement(['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Prime', 'Elite', 'Pro', 'Max', 'Ultra']);
            
            // Ensure uniqueness by appending number if needed
            $originalTeamName = $teamName;
            $counter = 1;
            while (TeamRegistration::where('tim_name', $teamName)
                    ->where('competition_category_id', $category->id)
                    ->exists()) {
                $teamName = $originalTeamName . ' ' . $counter;
                $counter++;
            }

            $registrationNumber = 'REG' . $category->name . date('Y') . str_pad($i + 1, 4, '0', STR_PAD_LEFT);
            
            // Generate leader data
            $leaderName = $faker->name;
            $leaderNim = $faker->numerify('G########');
            $leaderEmail = strtolower(str_replace(' ', '.', $leaderName)) . $faker->numberBetween(10, 99) . '@' . $faker->randomElement(['gmail.com', 'student.ipb.ac.id', 'apps.ipb.ac.id']);
            
            // Generate member data
            $member1Name = $faker->name;
            $member1Nim = $faker->numerify('G########');
            $member1Email = strtolower(str_replace(' ', '.', $member1Name)) . $faker->numberBetween(10, 99) . '@' . $faker->randomElement(['gmail.com', 'student.ipb.ac.id', 'apps.ipb.ac.id']);
            
            $member2Name = $faker->name;
            $member2Nim = $faker->numerify('G########');
            $member2Email = strtolower(str_replace(' ', '.', $member2Name)) . $faker->numberBetween(10, 99) . '@' . $faker->randomElement(['gmail.com', 'student.ipb.ac.id', 'apps.ipb.ac.id']);

            // Random status distribution
            $statusWeights = [
                'pending' => 20,
                'approved' => 60,
                'rejected' => 15,
                'cancelled' => 5
            ];
            
            $status = $faker->randomElement(array_merge(
                array_fill(0, $statusWeights['pending'], 'pending'),
                array_fill(0, $statusWeights['approved'], 'approved'),
                array_fill(0, $statusWeights['rejected'], 'rejected'),
                array_fill(0, $statusWeights['cancelled'], 'cancelled')
            ));

            $adminNotes = null;
            $reviewedBy = null;
            $reviewedAt = null;
            $registeredAt = null;
            $cancelledAt = null;

            if (in_array($status, ['approved', 'rejected'])) {
                $adminNotes = $status === 'approved' 
                    ? 'Tim telah memenuhi semua persyaratan pendaftaran. Berkas lengkap dan valid.'
                    : $faker->randomElement([
                        'Berkas pendaftaran tidak lengkap. Silakan lengkapi dokumen yang kurang.',
                        'Format berkas tidak sesuai ketentuan. Harap upload ulang dengan format yang benar.',
                        'Data anggota tim tidak valid. Pastikan semua data anggota benar dan lengkap.'
                    ]);
                $reviewedBy = User::where('role', 'admin')->inRandomOrder()->first()?->id;
                $reviewedAt = $faker->dateTimeBetween('-30 days', '-1 day');
                
                if ($status === 'approved') {
                    $registeredAt = $reviewedAt;
                }
            }

            if ($status === 'cancelled') {
                $cancelledAt = $faker->dateTimeBetween('-20 days', 'now');
            }

            try {
                TeamRegistration::create([
                    'uuid' => Str::uuid(),
                    'user_id' => $user->id,
                    'competition_category_id' => $category->id,
                    'registration_number' => $registrationNumber,
                    
                    // Team Information
                    'tim_name' => $teamName,
                    
                    // Leader Information
                    'leader_name' => $leaderName,
                    'leader_nim' => $leaderNim,
                    'leader_email' => $leaderEmail,
                    'leader_phone' => $faker->phoneNumber,
                    'leader_univ' => $university,
                    'leader_fakultas' => $faculty . ' / ' . $department,
                    
                    // Member 1 Information
                    'member1_name' => $member1Name,
                    'member1_nim' => $member1Nim,
                    'member1_email' => $member1Email,
                    'member1_phone' => $faker->phoneNumber,
                    'member1_univ' => $university,
                    'member1_fakultas' => $faculty . ' / ' . $department,
                    
                    // Member 2 Information
                    'member2_name' => $member2Name,
                    'member2_nim' => $member2Nim,
                    'member2_email' => $member2Email,
                    'member2_phone' => $faker->phoneNumber,
                    'member2_univ' => $university,
                    'member2_fakultas' => $faculty . ' / ' . $department,
                    
                    // Documents
                    'link_berkas' => 'https://drive.google.com/drive/folders/' . Str::random(20) . '/team-registration-documents',
                    
                    // Status and Admin Fields
                    'status' => $status,
                    'admin_notes' => $adminNotes,
                    'reviewed_by' => $reviewedBy,
                    'reviewed_at' => $reviewedAt,
                    'registered_at' => $registeredAt,
                    'cancelled_at' => $cancelledAt,
                ]);

                $this->command->info("Created team registration: {$teamName} - {$status}");
                
            } catch (\Exception $e) {
                $this->command->error("Failed to create team {$teamName}: " . $e->getMessage());
                continue;
            }
        }

        $this->command->info('Team Registration seeder completed successfully!');
    }
}
