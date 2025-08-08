<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('team_registrations', function (Blueprint $table) {
            $table->uuid('uuid')->unique()->after('id');
        });
    }

    public function down()
    {
        Schema::table('team_registrations', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};