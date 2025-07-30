<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('team_registrations', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'rejected'])
                  ->default('pending')
                  ->after('link_tugas');
        });
    }

    public function down(): void
    {
        Schema::table('team_registrations', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
