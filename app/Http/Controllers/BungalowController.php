<?php

namespace App\Http\Controllers;

use App\Models\Bungalow;
use Illuminate\Http\Request;

class BungalowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Bungalow::with('amenities', 'flexiblePrices')->get();
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
            'image' => 'required|string',
            'price' => 'required|numeric|min:0',
            'persons' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0',
            'description' => 'required|string',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ]);

        // Convert images array to JSON
        if (isset($data['images'])) {
            $data['images'] = json_encode($data['images']);
        }

        return Bungalow::create($data);
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
            'image' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'persons' => 'sometimes|integer|min:1',
            'bedrooms' => 'sometimes|integer|min:0',
            'description' => 'sometimes|string',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ]);

        // Convert images array to JSON
        if (isset($data['images'])) {
            $data['images'] = json_encode($data['images']);
        }

        $bungalow->update($data);
        return $bungalow;
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
