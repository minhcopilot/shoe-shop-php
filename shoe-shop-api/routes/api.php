<?php

// use App\Http\Controllers\CartController;

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/cart', [CartController::class, 'getCart']);
//     Route::post('/cart', [CartController::class, 'addToCart']);
//     Route::put('/cart', [CartController::class, 'updateCart']);
//     Route::delete('/cart', [CartController::class, 'removeFromCart']);
// });
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
Route::get('/cart', [CartController::class, 'getCart']);
Route::post('/cart', [CartController::class, 'addToCart']);
Route::put('/cart', [CartController::class, 'updateCart']);
Route::delete('/cart', [CartController::class, 'removeFromCart']);


