<?php

namespace Database\Seeders;

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
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@zeebries.com',
        ]);

        $this->call([
            GuestSeeder::class,
            AmenitySeeder::class,
            BungalowSeeder::class,
            DiscountCodeSeeder::class,
            FlexiblePriceOptionSeeder::class,
            SettingSeeder::class,
            ReservationSeeder::class,
        ]);
    }
}
