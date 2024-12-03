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
        Schema::table('band_members', function (Blueprint $table) {
            $table->foreign('band_id')->references('id')->on('bands')
            ->onUpdate('cascade')
            ->onDelete('cascade');
            $table->foreign('member_id')->references('id')->on('users')
            ->onUpdate('cascade')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('band_members', function (Blueprint $table) {
            $table->dropForeign(['band_id']);
            $table->dropForeign(['member_id']);
        });
    }
};
