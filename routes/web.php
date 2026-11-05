<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});
Route::resource('products', ProductController::class)
    ->except(['show']);

Route::resource('cart', CartController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->parameters([
        'cart' => 'product',
    ]);
