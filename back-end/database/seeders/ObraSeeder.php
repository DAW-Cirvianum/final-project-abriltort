<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Album;
use App\Models\Obra;
use App\Models\Tag;

class ObraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          // Assignar a un album de 3 a 6 obres
        Album::all()->each(function ($album) {
            Obra::factory(rand(3, 6))->create([
                'album_id' => $album->id,
            ])->each(function ($obra) {
                // Assignar a una obra de 2 a 4 tags aleatoris
                $tags = Tag::inRandomOrder()->take(rand(2, 4))->pluck('id');
                $obra->tags()->attach($tags);
            });
        });
    }
}
