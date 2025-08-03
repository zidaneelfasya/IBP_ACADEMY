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
        Schema::create('participant_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained('team_registrations')->onDelete('cascade');
            $table->foreignId('competition_stage_id')->constrained()->onDelete('cascade');

            $table->enum('status', ['not_started', 'in_progress', 'submitted', 'approved', 'rejected'])->default('not_started');

            $table->text('notes')->nullable(); // catatan dari admin
            $table->timestamp('submitted_at')->nullable(); // waktu submit oleh peserta
            $table->timestamp('approved_at')->nullable(); // waktu disetujui admin
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participant_progress');
    }
};
