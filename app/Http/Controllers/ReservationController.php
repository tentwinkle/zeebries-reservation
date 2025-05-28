<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

/**
 * Controller voor reserveringen
 */
class ReservationController extends Controller
{
    // Maak een nieuwe reservering
    public function store(Request $request)
    {
        $data = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'bungalow_id' => 'required|exists:bungalows,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $reservation = Reservation::create($data);
        return response()->json($reservation, 201);
    }
}
