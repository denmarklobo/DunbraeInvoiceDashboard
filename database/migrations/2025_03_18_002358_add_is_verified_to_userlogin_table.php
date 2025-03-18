<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('userlogin', function (Blueprint $table) {
            $table->boolean('is_verified')->default(false); // Add 'is_verified' column
        });
    }

    public function down()
    {
        Schema::table('userlogin', function (Blueprint $table) {
            $table->dropColumn('is_verified'); // Remove column if rolling back
        });
    }
};