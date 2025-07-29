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
            
            // Team leader information
            $table->string('leader_name');
            $table->string('leader_nim');
            
            // Team member 1 (optional)
            $table->string('member1_name')->nullable();
            $table->string('member1_nim')->nullable();
            
            // Team member 2 (optional)
            $table->string('member2_name')->nullable();
            $table->string('member2_nim')->nullable();
            
            // Team member 3 (optional)
            $table->string('member3_name')->nullable();
            $table->string('member3_nim')->nullable();
            
            // File links
            $table->string('ktm_scan_link');
            $table->string('formal_photo_link');
            $table->string('twibbon_link');
            $table->string('ig_account_link');
            
            // Other information
            $table->string('email');
            $table->string('ppt_link')->nullable();
            $table->string('image_link')->nullable();
            
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
