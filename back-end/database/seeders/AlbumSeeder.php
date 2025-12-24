<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Portfoli;
use App\Models\Album;

class AlbumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Portfoli::all()->each(function ($portfoli) {
            Album::factory(rand(2, 5))->create([
                'portfoli_id' => $portfoli->id,
            ]);
        });
    }
}
