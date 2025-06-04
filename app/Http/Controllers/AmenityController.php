<?php

namespace App\Http\Controllers;

use App\Models\Amenity;
use Illuminate\Http\Request;

class AmenityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Amenity::with('bungalows')->get();
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
            'name' => 'required|string|unique:amenities,name',
        ]);

        return Amenity::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Amenity $amenity)
    {
        return $amenity->load('bungalows');
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
    public function update(Request $request, Amenity $amenity)
    {
        $data = $request->validate([
            'name' => 'required|string|unique:amenities,name,' . $amenity->id,
        ]);

        $amenity->update($data);
        return $amenity;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Amenity $amenity)
    {
        $amenity->delete();
        return response()->noContent();
    }
}
