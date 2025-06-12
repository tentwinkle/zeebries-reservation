<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function show()
    {
        $setting = Setting::first();
        if (!$setting) {
            $setting = Setting::create(['dynamic_pricing' => false]);
        }
        return $setting;
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'dynamic_pricing' => 'required|boolean',
        ]);
        $setting = Setting::first();
        if (!$setting) {
            $setting = Setting::create($data);
        } else {
            $setting->update($data);
        }
        return $setting;
    }
}
