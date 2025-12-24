<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Obra;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visualitzacio>
 */
class VisualitzacioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'usuari_id' => User::inRandomOrder()->first()->id,
            'obra_id' => Obra::inRandomOrder()->first()->id,
            'data_visualitzacio' => now()->subMinutes(rand(1, 10000))
        ];
    }
}
