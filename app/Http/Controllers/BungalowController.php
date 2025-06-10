<?php

namespace App\Http\Controllers;

use App\Models\Bungalow;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BungalowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Bungalow::with('amenities', 'flexiblePrices');

        if ($date = $request->query('date')) {
            try {
                $parsed = Carbon::parse($date)->toDateString();
            } catch (\Exception $e) {
                $parsed = $date;
            }

            $query->whereDoesntHave('reservationItems.reservation', function ($q) use ($parsed) {
                $q->where('start_date', '<=', $parsed)
                  ->where('end_date', '>=', $parsed);
            });
        }

        return $query->get();
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
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'image' => 'required|image',
            'price' => 'required|numeric|min:0',
            'persons' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0',
            'description' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'image',
            'amenities' => 'array',
            'amenities.*' => 'exists:amenities,id',
        ]);

        // Convert images array to JSON
        $imagePath = $request->file('image')->store('bungalows', 'public');
        $data['image'] = '/storage/' . $imagePath;

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store('bungalows', 'public');
                $images[] = '/storage/' . $path;
            }
        }

        if ($images) {
            $data['images'] = json_encode($images);
        }

        $amenities = $data['amenities'] ?? [];
        unset($data['amenities']);

        $bungalow = Bungalow::create($data);

        if ($amenities) {
            $bungalow->amenities()->sync($amenities);
        }

        return $bungalow->load('amenities');
    }

    /**
     * Display the specified resource.
     */
    public function show(Bungalow $bungalow)
    {
        $bungalow->images = json_decode($bungalow->images);
        $bungalow->load('amenities', 'flexiblePrices');
        return $bungalow;
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
    public function update(Request $request, Bungalow $bungalow)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'image' => 'sometimes|image',
            'price' => 'sometimes|numeric|min:0',
            'persons' => 'sometimes|integer|min:1',
            'bedrooms' => 'sometimes|integer|min:0',
            'description' => 'sometimes|string',
            'images' => 'nullable|array',
            'images.*' => 'image',
            'amenities' => 'array',
            'amenities.*' => 'exists:amenities,id',
        ]);

        // Convert images array to JSON
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('bungalows', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store('bungalows', 'public');
                $images[] = '/storage/' . $path;
            }
        }
        if ($images) {
            $data['images'] = json_encode($images);
        }

        $amenities = $data['amenities'] ?? null;
        unset($data['amenities']);

        if (!empty($data)) {
            $bungalow->update($data);
        }

        if ($amenities !== null) {
            $bungalow->amenities()->sync($amenities);
        }

        return $bungalow->load('amenities');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bungalow $bungalow)
    {
        $bungalow->delete();
        return response()->noContent();
    }
}
