<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() { return Guest::all(); }

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
        // Define the fields you consider for identifying duplicates
        $criteria = [
            'email' => $request->input('email'),
            // Add more fields if needed, e.g., 'name' => $request->input('name')
        ];

        // Check if a guest with the same email already exists
        $existingGuest = Guest::where($criteria)->first();

        if ($existingGuest) {
            return $existingGuest;
        } else {
            $guest = Guest::create($request->all());
            return $guest;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Guest $guest) { return $guest; }

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
    public function update(Request $request, Guest $guest) {
        $guest->update($request->all());
        return $guest;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guest $guest) {
        $guest->delete();
        return response()->noContent();
    }
}
