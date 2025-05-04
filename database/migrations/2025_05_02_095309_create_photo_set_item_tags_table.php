<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('photo_set_item_tags', function (Blueprint $table) {
            $table->uuid('id');
            $table->foreignUuid('photo_set_item_id');
            $table->foreignUuid('tag_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photo_set_item_tags');
    }
};
