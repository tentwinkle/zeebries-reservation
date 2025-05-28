<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel voor bungalows
        Schema::create('bungalows', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->string('type');
            $table->json('extra_amenities')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bungalows');
    }
};
