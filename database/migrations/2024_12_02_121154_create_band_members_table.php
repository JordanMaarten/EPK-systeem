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
        Schema::create('band_members', function (Blueprint $table) {
            $table->bigInteger('band_id')->unsigned();
            $table->string('band_name');
            $table->bigInteger('member_id')->unsigned();
            $table->string('member_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('band_members');
    }
};
