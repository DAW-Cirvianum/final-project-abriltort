<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'nom' => 'Pintura',
                'descripcio' => 'Obres artístiques creades amb pintura',
            ],
            [
                'nom' => 'Fotografia',
                'descripcio' => 'Fotografies artístiques i creatives',
            ],
            [
                'nom' => 'Il·lustració',
                'descripcio' => 'Dibuixos i il·lustracions digitals o tradicionals',
            ],
            [
                'nom' => 'Escultura',
                'descripcio' => 'Obres artístiques en tres dimensions',
            ],
            [
                'nom' => 'Art Digital',
                'descripcio' => 'Creacions artístiques realitzades digitalment',
            ],
        ];

        foreach ($categories as $categoria) {
            Categoria::create($categoria);
        }
    }
}
