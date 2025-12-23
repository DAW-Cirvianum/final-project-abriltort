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
        Schema::create('obres', function (Blueprint $table) {
            $table->id();
             $table->foreignId('categoria_id')->constrained('categories')->onDelete('restrict'); 
            $table->foreignId('album_id')->constrained('albums')->onDelete('cascade'); 
            $table->string('titol');
            $table->text('descripcio');
            $table->date('data');
            $table->string('fitxer_url'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obres');
    }
};
