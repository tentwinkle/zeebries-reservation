<?php

namespace App\Http\Controllers;

use App\Models\DiscountCode;
use Illuminate\Http\Request;

class DiscountCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DiscountCode::all();
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
            'code' => 'required|string|unique:discount_codes,code',
            'name' => 'required|string',
            'percentage' => 'required|integer|min:1|max:100',
        ]);

        return DiscountCode::create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(DiscountCode $discountCode)
    {
        return $discountCode;
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
    public function update(Request $request, DiscountCode $discountCode)
    {
        $data = $request->validate([
            'code' => 'sometimes|string|unique:discount_codes,code,' . $discountCode->id,
            'name' => 'sometimes|string',
            'percentage' => 'sometimes|integer|min:1|max:100',
        ]);

        $discountCode->update($data);
        return $discountCode;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DiscountCode $discountCode)
    {
        $discountCode->delete();
        return response()->noContent();
    }
}
