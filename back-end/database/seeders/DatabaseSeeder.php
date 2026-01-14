<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Crear 9 usuaris normals (rol = 'usuari')
        User::factory(9)->create();

        // Crear 1 usuari admin
        User::factory()->admin()->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'rol' => 'user',
            'password' => bcrypt('12345678'),
        ]);

        // Portfolis
         $this->call([
            PortfoliSeeder::class,
            AlbumSeeder::class,
            CategoriaSeeder::class,
            TagSeeder::class,
            ObraSeeder::class,
             VisualitzacioSeeder::class,
        ]);
    }
}
