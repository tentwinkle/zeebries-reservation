<?php

namespace Database\Seeders;

use App\Models\{Reservation, ReservationItem, Guest, Bungalow, Amenity};
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $guest = Guest::inRandomOrder()->first();
        $bungalow = Bungalow::inRandomOrder()->first();
        $reservation = Reservation::create([
            'guest_id' => $guest->id,
            'discount_code_id' => null,
            'start_date' => now()->addDays(3)->toDateString(),
            'end_date' => now()->addDays(7)->toDateString(),
            'status' => 'confirmed',
            'total_cost' => 0,
        ]);

        $item = ReservationItem::create([
            'reservation_id' => $reservation->id,
            'bungalow_id' => $bungalow->id,
            'guests' => 2,
            'total_cost' => 360.00,
        ]);

        $amenity = Amenity::inRandomOrder()->first();
        $item->amenities()->attach($amenity->id);

        $reservation->total_cost = 360.00 + $amenity->price;
        $reservation->save();
    }
}
