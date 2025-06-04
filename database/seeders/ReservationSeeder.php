<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\Guest;
use App\Models\Bungalow;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        Reservation::create([
            'guest_id' => Guest::inRandomOrder()->first()->id,
            'bungalow_id' => Bungalow::inRandomOrder()->first()->id,
            'discount_code_id' => null,
            'start_date' => now()->addDays(3)->toDateString(),
            'end_date' => now()->addDays(7)->toDateString(),
            'status' => 'confirmed',
            'total_cost' => 360.00,
        ]);
    }
}
