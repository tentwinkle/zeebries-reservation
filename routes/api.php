<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    GuestController,
    ReservationController,
    BungalowController,
    AmenityController,
    DiscountCodeController,
    FlexiblePriceOptionController,
    EmployeeController
};

// =====================
// 🔓 Public Routes
// =====================
Route::get('/bungalows', [BungalowController::class, 'index']);
Route::get('/bungalows/{bungalow}', [BungalowController::class, 'show']);
Route::post('/guests', [GuestController::class, 'store']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::get('/my-reservation/{id}', [ReservationController::class, 'showForGuest']);
Route::get('/discount-codes', [DiscountCodeController::class, 'index']);
Route::get('/amenities', [AmenityController::class, 'index']);

// =====================
// 🔐 Authenticated Routes (Sanctum Protected)
// =====================
Route::middleware('auth:sanctum')->group(function () {
    // Guests CRUD
    Route::apiResource('guests', GuestController::class)->except(['store']);

    // Full CRUD for Reservations, Bungalows, etc.
    Route::apiResource('reservations', ReservationController::class)->except(['store']); // Store is public
    Route::apiResource('bungalows', BungalowController::class)->except(['index', 'show']);
    Route::apiResource('amenities', AmenityController::class)->except(['index', 'show']);
    Route::apiResource('discount-codes', DiscountCodeController::class) ->except(['index', 'show']);
    Route::apiResource('flexible-price-options', FlexiblePriceOptionController::class);
});
