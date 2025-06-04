<?php

namespace Database\Seeders;

use App\Models\DiscountCode;
use Illuminate\Database\Seeder;

class DiscountCodeSeeder extends Seeder
{
    public function run(): void
    {
        DiscountCode::create([
            'code' => 'SUMMER10',
            'name' => 'Summer Discount',
            'percentage' => 10,
        ]);

        DiscountCode::create([
            'code' => 'WELCOME5',
            'name' => 'First-Time Guest',
            'percentage' => 5,
        ]);
    }
}
