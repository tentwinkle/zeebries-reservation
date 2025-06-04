<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->foreignId('bungalow_id')->constrained()->onDelete('cascade');
            $table->integer('guests');
            $table->decimal('total_cost', 10, 2);
            $table->timestamps();
        });

        Schema::create('amenity_reservation_item', function (Blueprint $table) {
            $table->foreignId('reservation_item_id')->constrained()->onDelete('cascade');
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->primary(['reservation_item_id', 'amenity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amenity_reservation_item');
        Schema::dropIfExists('reservation_items');
    }
};