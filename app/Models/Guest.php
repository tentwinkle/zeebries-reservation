<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name', 'email', 'address', 'postal_code', 'phone_number'
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
