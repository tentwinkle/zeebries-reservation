<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Guest;

class GuestSeeder extends Seeder
{
    public function run(): void
    {
        // Voorbeeld gasten
        Guest::create([
            'name' => 'Jan Jansen',
            'email' => 'jan@example.com',
            'address' => 'Dorpsstraat 1',
            'postal_code' => '1234AB',
            'phone_number' => '0612345678',
        ]);

        Guest::create([
            'name' => 'Piet Pietersen',
            'email' => 'piet@example.com',
            'address' => 'Baanweg 2',
            'postal_code' => '2345CD',
            'phone_number' => '0687654321',
        ]);
    }
}
