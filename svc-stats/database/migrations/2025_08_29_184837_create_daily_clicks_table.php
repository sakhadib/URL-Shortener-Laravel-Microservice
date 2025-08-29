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
        Schema::create('daily_clicks', function (Blueprint $table) {
            $table->string('code', 20);
            $table->date('date');
            $table->unsignedBigInteger('clicks')->default(0);
            $table->primary(['code', 'date']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_clicks');
    }
};
