<?php

namespace App\Http\Controllers;

use App\Models\FlexiblePriceOption;
use Illuminate\Http\Request;

class FlexiblePriceOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return FlexiblePriceOption::with('bungalow')->get();
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
            'bungalow_id' => 'required|exists:bungalows,id',
            'price_modifier' => 'required|numeric',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        return FlexiblePriceOption::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(FlexiblePriceOption $flexiblePriceOption)
    {
        return $flexiblePriceOption->load('bungalow');
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
    public function update(Request $request, FlexiblePriceOption $flexiblePriceOption)
    {
        $data = $request->validate([
            'bungalow_id' => 'sometimes|exists:bungalows,id',
            'price_modifier' => 'sometimes|numeric',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
        ]);

        $flexiblePriceOption->update($data);
        return $flexiblePriceOption;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FlexiblePriceOption $flexiblePriceOption)
    {
        $flexiblePriceOption->delete();
        return response()->noContent();
    }
}
