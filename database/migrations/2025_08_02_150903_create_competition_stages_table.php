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
        Schema::create('competition_stages', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Registrasi", "Preliminary", "Semifinal", "Final"
            $table->unsignedInteger('order')->default(1); // untuk urutan tampilan
            $table->timestamps();
            $table->dateTime('start_date')->nullable(); 
            $table->dateTime('end_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_stages');
    }
};
