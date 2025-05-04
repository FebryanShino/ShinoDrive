<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $tags = ['cosplay', 'game', 'original', 'nikke', 'blue_archive'];

        foreach ($tags as $tag) {

            Tag::create(['name' => $tag]);
        }
    }
}
