<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_registration_id')->constrained()->onDelete('cascade');

            // rekening TUJUAN (admin)
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('account_holder');

            // rekening SUMBER (peserta)
            $table->string('sender_account_number')->nullable();
            $table->string('sender_account_holder')->nullable();

            $table->decimal('amount', 10, 2);
            $table->string('payment_proof_path')->nullable();
            $table->string('status')->default('pending'); // pending, verified, rejected
            $table->text('admin_notes')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
