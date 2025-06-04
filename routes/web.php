<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/create-reservation', function () {
    return Inertia::render('create-reservation');
})->name('create-reservation');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/reservations', function () {
        return Inertia::render('reservations');
    })->name('reservations');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
