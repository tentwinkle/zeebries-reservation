<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $fillable = ['name', 'label', 'price'];

    public function bungalows()
    {
        return $this->belongsToMany(Bungalow::class);
    }
    
    public function reservationItems()
    {
        return $this->belongsToMany(ReservationItem::class, 'amenity_reservation_item');
    }
}
