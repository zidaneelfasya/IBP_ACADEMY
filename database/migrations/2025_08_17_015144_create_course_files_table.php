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
        Schema::create('course_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade'); // Relasi ke courses
            $table->string('original_name'); // Nama file asli
            $table->string('file_name'); // Nama file yang disimpan
            $table->string('file_path'); // Path file
            $table->string('file_type'); // Type file (image, video, document, etc)
            $table->string('mime_type'); // MIME type
            $table->integer('file_size'); // Ukuran file dalam bytes
            $table->timestamps();

            // Add indexes
            $table->index('course_id');
            $table->index('file_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_files');
    }
};
