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
        Schema::create('products', function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->id();
            // Relasi dengan tabel categories
            $table->foreignId('category_id')
                ->constrained('categories')
                ->restrictOnDelete();
            // Informasi produk
            $table->string('name', 150);
            $table->string('sku', 100)
                ->nullable()
                ->unique();
            $table->text('description')->nullable();
            // Harga dan stok
            $table->decimal('price', 12, 2);
            $table->unsignedInteger('stock')->default(0);
            // Path gambar produk
            $table->string('image_path', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
