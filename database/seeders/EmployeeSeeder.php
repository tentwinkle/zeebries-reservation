<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Voorbeeld medewerkers
        Employee::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        Employee::create([
            'name' => 'Medewerker',
            'email' => 'medewerker@example.com',
            'password' => Hash::make('secret'),
        ]);
    }
}
