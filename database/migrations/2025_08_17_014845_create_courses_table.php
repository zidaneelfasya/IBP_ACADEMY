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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Judul Materi
            $table->text('description'); 
            $table->longText('content'); // Konten Lengkap
            $table->string('video_url')->nullable(); // Link Video (Opsional)
            $table->string('cover_image')->nullable(); // Gambar Cover
            $table->foreignId('competition_category_id')->constrained('competition_categories')->onDelete('cascade'); // Relasi ke competition_categories
            $table->integer('read_count')->default(0); // Jumlah yang membaca
            $table->boolean('is_active')->default(true); // Status aktif/tidak
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // Pembuat materi
            $table->timestamps();

            // Add indexes for better performance
            $table->index('competition_category_id');
            $table->index('is_active');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
