<?php

namespace App\Http\Controllers;

use App\Models\{Reservation, Bungalow, Amenity};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Mail\ReservationConfirmation;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return Reservation::with(['guest', 'items.bungalow', 'items.amenities', 'discountCode'])->get();
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
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'nullable|string',
            'discount_code_id' => 'nullable|exists:discount_codes,id',
            'total_cost' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.bungalow_id' => 'required|exists:bungalows,id',
            'items.*.guests' => 'required|integer|min:1',
            'items.*.amenities' => 'array',
            'items.*.amenities.*' => 'exists:amenities,id'
        ]);

        // Set default status if not provided or empty
        $data['status'] = $data['status'] ?? 'pending';
        $items = $data['items'];
        unset($data['items']);

        $nights = Carbon::parse($data['start_date'])->diffInDays(Carbon::parse($data['end_date']));

        DB::beginTransaction();
        $reservation = Reservation::create($data);

        $total = 0;
        foreach ($items as $item) {
            $bungalow = Bungalow::find($item['bungalow_id']);
            $amenities = Amenity::whereIn('id', $item['amenities'] ?? [])
                ->whereHas('bungalows', function ($q) use ($bungalow) {
                    $q->where('bungalow_id', $bungalow->id);
                })->get();
            $price = $bungalow->currentPrice($data['start_date'], $data['end_date']);
            $cost = ($price * $nights) + $amenities->sum('price');

            $resItem = $reservation->items()->create([
                'bungalow_id' => $bungalow->id,
                'guests' => $item['guests'],
                'total_cost' => $cost
            ]);

            if ($amenities->count()) {
                $resItem->amenities()->sync($amenities->pluck('id'));
            }

            $total += $cost;
        }

        if ($reservation->discount_code_id) {
            $discount = $reservation->discountCode->percentage ?? 0;
            $total -= $total * $discount / 100;
        }

        $reservation->total_cost = $total;
        $reservation->save();
        DB::commit();

        $reservation->load(['guest', 'items.bungalow', 'items.amenities']);
        Mail::to($reservation->guest->email)
            ->send(new ReservationConfirmation($reservation));

        return $reservation;
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation) {
        return $reservation->load(['guest', 'items.bungalow', 'items.amenities', 'discountCode']);
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
            ->with(['guest', 'items.bungalow', 'items.amenities'])
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
        $data = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|string',
            'discount_code_id' => 'sometimes|exists:discount_codes,id',
            'total_cost' => 'sometimes|numeric',
            'items' => 'sometimes|array',
            'items.*.bungalow_id' => 'required_with:items|exists:bungalows,id',
            'items.*.guests' => 'required_with:items|integer|min:1',
            'items.*.amenities' => 'array',
            'items.*.amenities.*' => 'exists:amenities,id'
        ]);

        $items = $data['items'] ?? null;
        unset($data['items']);
        $reservation->update($data);

        if ($items !== null) {
            // remove old items
            foreach ($reservation->items as $it) { $it->amenities()->detach(); }
            $reservation->items()->delete();

            $nights = Carbon::parse($reservation->start_date)->diffInDays(Carbon::parse($reservation->end_date));
            $total = 0;
            foreach ($items as $item) {
                $bungalow = Bungalow::find($item['bungalow_id']);
                $amenities = Amenity::whereIn('id', $item['amenities'] ?? [])
                    ->whereHas('bungalows', function ($q) use ($bungalow) {
                        $q->where('bungalow_id', $bungalow->id);
                    })->get();
                $price = $bungalow->currentPrice($reservation->start_date, $reservation->end_date);
                $cost = ($price * $nights) + $amenities->sum('price');
                $resItem = $reservation->items()->create([
                    'bungalow_id' => $bungalow->id,
                    'guests' => $item['guests'],
                    'total_cost' => $cost
                ]);
                if ($amenities->count()) {
                    $resItem->amenities()->sync($amenities->pluck('id'));
                }
                $total += $cost;
            }
            if ($reservation->discount_code_id) {
                $discount = $reservation->discountCode->percentage ?? 0;
                $total -= $total * $discount / 100;
            }
            $reservation->total_cost = $total;
            $reservation->save();
        }

        return $reservation->load(['items.bungalow', 'items.amenities']);
    }

    public function cancel(Reservation $reservation)
    {
        $reservation->status = 'cancelled';
        $reservation->save();
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