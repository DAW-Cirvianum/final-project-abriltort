<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Portfoli;

class PortfoliSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         User::all()->each(function ($user) {
            Portfoli::factory()->create([
                'usuari_id' => $user->id,
                'titol' => 'Portfoli de ' . $user->name,
            ]);
        });
    }
}
