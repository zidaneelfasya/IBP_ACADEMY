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
        Schema::table('courses', function (Blueprint $table) {
            $table->boolean('is_semifinal')->default(false)->after('is_active')
                ->comment('True jika materi khusus untuk peserta semifinal');
            
            // Add index for better query performance
            $table->index('is_semifinal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropIndex(['is_semifinal']);
            $table->dropColumn('is_semifinal');
        });
    }
};
