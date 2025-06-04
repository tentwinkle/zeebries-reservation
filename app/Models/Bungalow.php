<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bungalow extends Model
{
    protected $fillable = ['name', 'description', 'price', 'images', 'image', 'persons', 'bedrooms'];

    protected $casts = [
        'images' => 'array',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function flexiblePrices()
    {
        return $this->hasMany(FlexiblePriceOption::class);
    }
}
