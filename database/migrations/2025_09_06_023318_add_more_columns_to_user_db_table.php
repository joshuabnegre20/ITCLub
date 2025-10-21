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
        Schema::table('user_db', function (Blueprint $table) {
            $table->string('name')->after('username');
            $table->string('last_name')->after('name');
            $table->string('address')->after('last_name');
            $table->string('gender')->after('address');
            $table->string('club')->after('gender');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_db', function (Blueprint $table) {
            $table->dropColumn('name','last_name','address','gender','club');
        });
    }
};
