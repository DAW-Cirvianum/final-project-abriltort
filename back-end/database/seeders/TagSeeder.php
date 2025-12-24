<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'abstracte',
            'retrat',
            'paisatge',
            'blanc i negre',
            'color',
            'minimalista',
            'digital',
            'tradicional',
        ];

        foreach ($tags as $tag) {
            Tag::create(['nom' => $tag]);
        }
    }
}
