<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Portfoli>
 */
class PortfoliFactory extends Factory
{
    protected $model = \App\Models\Portfoli::class;
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
            'usuari_id' => User::factory(), 
        ];
    }
}
