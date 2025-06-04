<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'guest_id', 'bungalow_id', 'discount_code_id',
        'start_date', 'end_date', 'status', 'total_cost'
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function bungalow()
    {
        return $this->belongsTo(Bungalow::class);
    }

    public function discountCode()
    {
        return $this->belongsTo(DiscountCode::class);
    }
}
