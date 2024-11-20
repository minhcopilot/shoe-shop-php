<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CartController;

// Các route của giỏ hàng
Route::prefix('cart')->group(function() {
    // Lấy giỏ hàng của người dùng
    Route::get('/', [CartController::class, 'index']); // API này sẽ trả về giỏ hàng của người dùng
    
    // Thêm sản phẩm vào giỏ hàng
    Route::post('/', [CartController::class, 'store']); // API này thêm sản phẩm vào giỏ hàng
    
    // Cập nhật giỏ hàng (số lượng sản phẩm)
    Route::put('/{id}', [CartController::class, 'update']); // API này cập nhật số lượng
    
    // Xóa sản phẩm khỏi giỏ hàng
    Route::delete('/{id}', [CartController::class, 'destroy']); // API này xóa sản phẩm khỏi giỏ hàng
});
