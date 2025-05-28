<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model voor reserveringen
 */
class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_id',
        'bungalow_id',
        'start_date',
        'end_date',
        'employee_id',
    ];

    protected $dates = [
        'start_date',
        'end_date',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function bungalow()
    {
        return $this->belongsTo(Bungalow::class);
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
