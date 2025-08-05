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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('competition_category_id')->constrained()->onDelete('cascade');
            $table->string('registration_number')->unique();

            // Team Information
            $table->string('tim_name', 100);
            $table->string('asal_universitas', 200);
            $table->string('prodi_fakultas', 200);

            // Leader Information
            $table->string('leader_name', 100);
            $table->string('leader_nim', 20);
            $table->string('leader_email', 100);
            $table->string('leader_phone', 15);

            // Member 1 Information
            $table->string('member1_name', 100);
            $table->string('member1_nim', 20);
            $table->string('member1_email', 100);
            $table->string('member1_phone', 15);

            // Member 2 Information
            $table->string('member2_name', 100);
            $table->string('member2_nim', 20);
            $table->string('member2_email', 100);
            $table->string('member2_phone', 15);

            // Member 3 Information
            $table->string('member3_name', 100);
            $table->string('member3_nim', 20);
            $table->string('member3_email', 100);
            $table->string('member3_phone', 15);

            // Documents
            $table->string('link_berkas', 500);

            // Status and Admin Fields
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('registered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['competition_category_id', 'status']);
            $table->index(['user_id', 'competition_category_id']);
            $table->index('registration_number');
            $table->index('tim_name');
            $table->index('status');

            // Unique constraints per category
            $table->unique(['tim_name', 'competition_category_id']);
            $table->unique(['leader_nim', 'competition_category_id']);
            $table->unique(['leader_email', 'competition_category_id']);
            $table->unique(['member1_nim', 'competition_category_id']);
            $table->unique(['member1_email', 'competition_category_id']);
            $table->unique(['member2_nim', 'competition_category_id']);
            $table->unique(['member2_email', 'competition_category_id']);
            $table->unique(['member3_nim', 'competition_category_id']);
            $table->unique(['member3_email', 'competition_category_id']);
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
