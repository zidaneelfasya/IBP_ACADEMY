<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use App\Models\TeamRegistration;

class TeamRegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID'); // Indonesian locale
        $kategoriLomba = ['BCC', 'BPC'];

        for ($i = 0; $i < 20; $i++) {
            TeamRegistration::create([
                'tim_name' => 'Tim ' . $faker->company,
                'asal_universitas' => $faker->company . ' University',
                'prodi_fakultas' => 'Fakultas ' . $faker->word,
                
                // Leader info
                'leader_name' => $faker->name,
                'leader_nim' => 'G' . $faker->unique()->numberBetween(1000000, 9999999),
                'leader_email' => $faker->unique()->safeEmail,
                'leader_phone' => $faker->phoneNumber,
                
                // Members (optional)
                'member1_name' => $faker->boolean(70) ? $faker->name : null,
                'member1_nim' => $faker->boolean(70) ? 'G' . $faker->unique()->numberBetween(1000000, 9999999) : null,
                
                'member2_name' => $faker->boolean(50) ? $faker->name : null,
                'member2_nim' => $faker->boolean(50) ? 'G' . $faker->unique()->numberBetween(1000000, 9999999) : null,
                
                'member3_name' => $faker->boolean(30) ? $faker->name : null,
                'member3_nim' => $faker->boolean(30) ? 'G' . $faker->unique()->numberBetween(1000000, 9999999) : null,
                
                'link_berkas' => 'https://drive.google.com/file/d/' . $faker->uuid . '/view',
                'status' => $faker->randomElement(['pending', 'verified', 'rejected']),
                'kategori_lomba' => $faker->randomElement($kategoriLomba),
            ]);
        }
    }
}