<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DiscountCode;

class DiscountCodeSeeder extends Seeder
{
    public function run(): void
    {
        // Voorbeeld kortingscodes
        DiscountCode::create([
            'code' => 'ZEEBRIES10',
            'percentage' => 10,
            'name' => 'Voorjaarskorting',
        ]);

        DiscountCode::create([
            'code' => 'ZEEBRIES20',
            'percentage' => 20,
            'name' => 'Zomerdeal',
        ]);
    }
}
