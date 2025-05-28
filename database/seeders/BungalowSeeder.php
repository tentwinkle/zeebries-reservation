<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bungalow;

class BungalowSeeder extends Seeder
{
    public function run(): void
    {
        // Voorbeeld bungalows
        Bungalow::create([
            'number' => '101',
            'type' => 'comfort',
            'extra_amenities' => ['wifi', 'tv'],
        ]);

        Bungalow::create([
            'number' => '102',
            'type' => 'luxe',
            'extra_amenities' => ['wifi', 'jacuzzi'],
        ]);

        Bungalow::create([
            'number' => '103',
            'type' => 'standaard',
            'extra_amenities' => ['wifi'],
        ]);
    }
}
