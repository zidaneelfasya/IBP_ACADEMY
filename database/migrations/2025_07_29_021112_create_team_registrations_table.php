<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('team_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('tim_name');
            $table->string('asal_universitas');
            $table->string('prodi_fakultas');
            
            // Team leader information
            $table->string('leader_name');
            $table->string('leader_nim');
            $table->string('leader_email');
            $table->string('leader_phone');
            
            // Team members (optional)
            $table->string('member1_name')->nullable();
            $table->string('member1_nim')->nullable();
            $table->string('member2_name')->nullable();
            $table->string('member2_nim')->nullable();
            $table->string('member3_name')->nullable();
            $table->string('member3_nim')->nullable();
            
            // File links and status
            $table->string('link_berkas');
            $table->string('status')->default('pending');
            $table->string('kategori_lomba');
            
            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_registrations');
    }
};