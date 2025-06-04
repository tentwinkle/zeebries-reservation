<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            [
                'name' => 'fireplace',
                'label' => 'Openhaard',
                'price' => 20
            ],
            [
                'name' => 'bath',
                'label' => 'Ligbad',
                'price' => 20
            ],
            [
                'name' => 'sauna',
                'label' => 'Sauna',
                'price' => 30
            ],
            [
                'name' => 'jacuzzi',
                'label' => 'Jacuzzi',
                'price' => 30
            ],
            [
                'name' => 'waterpark',
                'label' => 'Zwemparadijs',
                'price' => 100
            ],
            [
                'name' => 'wifi',
                'label' => 'Wifi',
                'price' => 20
            ],
            [
                'name' => 'airco',
                'label' => 'Airco',
                'price' => 50
            ],
        ];
        foreach ($amenities as $data) {
            $amenity = Amenity::where('name', $data['name'])->first();
            if (!$amenity) {
                Amenity::create($data);
            }
        }
    }
}
