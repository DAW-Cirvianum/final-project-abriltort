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
        Schema::create('visualitzacions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuari_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('obra_id')->constrained('obres')->onDelete('cascade');
            $table->timestamp('data_visualitzacio')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visualitzacions');
    }
};
