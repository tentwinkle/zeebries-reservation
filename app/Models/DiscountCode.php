<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    protected $fillable = ['code', 'name', 'percentage'];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
