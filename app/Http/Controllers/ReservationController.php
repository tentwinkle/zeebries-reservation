<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return Reservation::with(['guest', 'bungalow', 'discountCode'])->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        $data = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'bungalow_id' => 'required|exists:bungalows,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'nullable|string',
            'discount_code_id' => 'nullable|exists:discount_codes,id',
            'total_cost' => 'required|numeric'
        ]);

        // Set default status if not provided or empty
        $data['status'] = $data['status'] ?? 'pending';

        return Reservation::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation) {
        return $reservation->load(['guest', 'bungalow', 'discountCode']);
    }

    /**
     * Show the specified resource.
     */
    public function showForGuest($id, Request $request)
    {
        $reservation = Reservation::where('id', $id)
            ->whereHas('guest', function ($query) use ($request) {
                $query->where('email', $request->get('email'));
            })
            ->with(['guest', 'bungalow'])
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        return $reservation;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation) {
        $reservation->update($request->all());
        return $reservation;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation) {
        $reservation->delete();
        return response()->noContent();
    }
}