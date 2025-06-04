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
}
