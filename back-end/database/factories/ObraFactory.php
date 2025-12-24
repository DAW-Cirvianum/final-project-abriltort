<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Album;
use App\Models\Categoria;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Obra>
 */
class ObraFactory extends Factory
{
    protected $model = \App\Models\Obra::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titol' => $this->faker->sentence(3),
            'descripcio' => $this->faker->paragraph(),
            'album_id' => Album::inRandomOrder()->first()->id,
            'categoria_id' => Categoria::inRandomOrder()->first()->id,
            'fitxer_url' => 'https://picsum.photos/seed/' . $this->faker->uuid . '/800/600',
        ];
    }
}
