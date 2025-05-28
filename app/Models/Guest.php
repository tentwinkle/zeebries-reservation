<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model voor gasten
 */
class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'address',
        'postal_code',
        'phone_number',
    ];
}
