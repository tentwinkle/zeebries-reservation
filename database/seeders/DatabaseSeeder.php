<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Roep de individuele seeders aan
        $this->call([
            EmployeeSeeder::class,
            GuestSeeder::class,
            BungalowSeeder::class,
            ReservationSeeder::class,
            DiscountCodeSeeder::class,
        ]);
    }
}
