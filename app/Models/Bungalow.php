<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model voor bungalows
 */
class Bungalow extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'type',
        'extra_amenities',
    ];

    protected $casts = [
        'extra_amenities' => 'array',
    ];
}
