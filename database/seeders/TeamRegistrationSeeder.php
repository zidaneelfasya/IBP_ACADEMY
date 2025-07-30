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

        for ($i = 0; $i < 20; $i++) {
            TeamRegistration::create([
                'leader_name' => $faker->name,
                'leader_nim' => 'G' . $faker->unique()->numberBetween(1000000, 9999999),
                
                // 70% chance to have at least 1 member
                'member1_name' => $faker->boolean(70) ? $faker->name : null,
                'member1_nim' => $faker->boolean(70) ? 'G' . $faker->unique()->numberBetween(1000000, 9999999) : null,
                
                // 50% chance to have a 2nd member
                'member2_name' => $faker->boolean(50) ? $faker->name : null,
                'member2_nim' => $faker->boolean(50) ? 'G' . $faker->unique()->numberBetween(1000000, 9999999) : null,
                
                // 30% chance to have a 3rd member
                'member3_name' => $faker->boolean(30) ? $faker->name : null,
                'member3_nim' => $faker->boolean(30) ? 'G' . $faker->unique()->numberBetween(1000000, 9999999) : null,
                
                'link_berkas' => 'https://drive.google.com/file/d/' . $faker->uuid . '/view',

                'email' => $faker->unique()->safeEmail,
                
                // 60% chance to have PPT
                'link_tugas' => $faker->boolean(60) ? 'https://drive.google.com/file/d/' . $faker->uuid . '/view' : null,
                
               
               
            ]);
        }
    }
}