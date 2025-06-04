<?php

namespace Database\Seeders;

use App\Models\FlexiblePriceOption;
use App\Models\Bungalow;
use Illuminate\Database\Seeder;

class FlexiblePriceOptionSeeder extends Seeder
{
    public function run(): void
    {
        $bungalow = Bungalow::inRandomOrder()->first();

        FlexiblePriceOption::create([
            'bungalow_id' => $bungalow->id,
            'price_modifier' => -10.00,
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(15),
        ]);
    }
}
