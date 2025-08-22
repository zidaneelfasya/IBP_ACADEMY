<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->foreignId('competition_category_id')->nullable()->constrained()->onDelete('cascade')->after('competition_stage_id');
        });

        // Update existing assignments - set default category (BCC = id 1)
        DB::statement("UPDATE assignments SET competition_category_id = 1 WHERE competition_category_id IS NULL");

        Schema::table('assignments', function (Blueprint $table) {
            $table->foreignId('competition_category_id')->nullable(false)->change();
            
            // Use a custom shorter index name
            $table->index(
                ['competition_category_id', 'competition_stage_id', 'is_active'],
                'assignments_category_stage_active_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assignments', function (Blueprint $table) {
            // Drop the index using the custom name
            $table->dropIndex('assignments_category_stage_active_index');
            $table->dropForeign(['competition_category_id']);
            $table->dropColumn('competition_category_id');
        });
    }
};