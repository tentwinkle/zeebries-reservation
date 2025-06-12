<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Setting;

class Bungalow extends Model
{
    protected $fillable = ['name', 'description', 'price', 'images', 'image', 'persons', 'bedrooms'];

    protected $appends = ['current_price'];

    protected $casts = [
        'images' => 'array',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reservationItems()
    {
        return $this->hasMany(ReservationItem::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function flexiblePrices()
    {
        return $this->hasMany(FlexiblePriceOption::class);
    }

    public function getCurrentPriceAttribute()
    {
        return $this->currentPrice();
    }

    public function currentPrice($startDate = null, $endDate = null)
    {
        $price = $this->price;

        $options = $this->flexiblePrices();
        if ($startDate && $endDate) {
            $options->whereDate('start_date', '<=', $endDate)
                    ->whereDate('end_date', '>=', $startDate);
        } else {
            $today = now()->toDateString();
            $options->whereDate('start_date', '<=', $today)
                    ->whereDate('end_date', '>=', $today);
        }

        foreach ($options->get() as $opt) {
            $price += $opt->price_modifier;
        }

        $setting = Setting::first();
        if ($setting && $setting->dynamic_pricing) {
            $bookings = $this->reservationItems()
                ->whereHas('reservation', function ($q) {
                    $q->where('status', 'confirmed')
                      ->whereMonth('start_date', now()->month);
                })->count();

            if ($bookings < 3) {
                $price *= 0.9;
            } elseif ($bookings > 8) {
                $price *= 1.1;
            }
        }

        return round($price, 2);
    }
}
