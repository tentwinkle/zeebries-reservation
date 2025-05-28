<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // Voorbeeld reserveringen
        Reservation::create([
            'guest_id' => 1,
            'bungalow_id' => 1,
            'start_date' => '2024-07-01',
            'end_date' => '2024-07-07',
            'employee_id' => 1,
        ]);

        Reservation::create([
            'guest_id' => 2,
            'bungalow_id' => 2,
            'start_date' => '2024-08-10',
            'end_date' => '2024-08-17',
            'employee_id' => 2,
        ]);
    }
}
