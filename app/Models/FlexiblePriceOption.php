<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlexiblePriceOption extends Model
{
    protected $fillable = ['bungalow_id', 'price_modifier', 'start_date', 'end_date'];

    public function bungalow()
    {
        return $this->belongsTo(Bungalow::class);
    }
}
