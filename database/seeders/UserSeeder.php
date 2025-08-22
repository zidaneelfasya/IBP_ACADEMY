<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),


            ],
            [
                'name' => 'zidane elfasya',
                'email' => 'elfasyazidan1@gmail.com',
                'password' => Hash::make('saya1234'),
                'role' => 'user',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'John Doe',
                'email' => 'jaka@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        ]);
    }
}
