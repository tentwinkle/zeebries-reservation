<?php

use App\Models\ReservationItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('bungalow index can filter by date', function () {
    $this->seed();

    $reservedId = ReservationItem::first()->bungalow_id;
    $date = now()->addDays(4)->toDateString();

    $response = $this->getJson('/api/bungalows?date=' . $date);
    $response->assertOk();

    $ids = array_column($response->json(), 'id');
    expect($ids)->not()->toContain($reservedId);
});