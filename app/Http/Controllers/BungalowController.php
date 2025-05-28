<?php

namespace App\Http\Controllers;

use App\Models\Bungalow;
use Illuminate\Http\Request;

/**
 * Controller voor bungalows
 */
class BungalowController extends Controller
{
    // Toon alle bungalows
    public function index()
    {
        return response()->json(Bungalow::all());
    }
}
