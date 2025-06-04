<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationItem extends Model
{
    protected $fillable = [
        'reservation_id', 'bungalow_id', 'guests', 'total_cost'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function bungalow()
    {
        return $this->belongsTo(Bungalow::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'amenity_reservation_item');
    }
}