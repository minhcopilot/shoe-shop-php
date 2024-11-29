<?php


use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SizesController;
use App\Http\Controllers\ChatController;
Route::get('/cart', [CartController::class, 'getCart']);
Route::post('/cart', [CartController::class, 'addToCart']);
Route::put('/cart', [CartController::class, 'updateCart']);
Route::delete('/cart', [CartController::class, 'removeFromCart']);

use App\Http\Controllers\OrderController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::put('/cart/update', [CartController::class, 'updateCart']);
    Route::delete('/cart/remove', [CartController::class, 'removeFromCart']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/order/add', [OrderController::class, 'createOrder']);
    Route::put('/order/update/{order}', [OrderController::class, 'updateOrderStatus']);
    Route::get('/orders', [OrderController::class, 'getOrderHistory']);
    Route::delete('/order/delete/{order}', [OrderController::class, 'deleteOrder']);
    Route::get('/orders/search', [OrderController::class, 'searchOrders']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//category
Route::prefix('categories')->group(function ()  {
    Route::get('', [CategoryController::class, 'index']);
    Route::post('', [CategoryController::class, 'store']);
    Route::get('/{category}', [CategoryController::class, 'show']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
    Route::get('/trashed/all', [CategoryController::class, 'getTrashed']);
    Route::put('/restore/{id}', [CategoryController::class, 'restore']);
});
// ->middleware('auth:sanctum')
//Products
Route::prefix('products')->group(function () {
    Route::get('/', [ProductsController::class, 'index']);
    Route::post('/', [ProductsController::class, 'store']);
    Route::get('/{id}', [ProductsController::class, 'show']);
    Route::put('/{id}', [ProductsController::class, 'update']);
    Route::delete('/{id}', [ProductsController::class, 'destroy']);
    Route::get('/trashed', [ProductsController::class, 'getTrashed']);
    Route::put('/restore/{id}', [ProductsController::class, 'restore']);
    Route::post('/upload-images', [ProductsController::class, 'uploadImages']);
});

//Size
Route::prefix('sizes')->group(function () {
    Route::get('/', [SizesController::class, 'index']);
    Route::post('/', [SizesController::class, 'store']);
    Route::put('/{id}', [SizesController::class, 'update']);
    Route::delete('/{id}', [SizesController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->get('/auth/user', [AuthController::class, 'getUser']);

// Đăng ký và đăng nhập
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');

Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Logout
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);

// Gửi email xác thực
Route::middleware('auth:sanctum')->get('/email/verify/send', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.']);
    }
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification email sent.']);
});

// Xác thực email
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = \App\Models\User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Invalid verification link.'], 403);
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

     // Chuyển hướng đến trang verify-successful
     return redirect('http://localhost:3000/verify-successful');
})->name('verification.verify');
// Route chỉ dành cho người dùng đã xác thực email
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/protected', function () {
        return response()->json(['message' => 'Access granted.']);
    });
});

Route::get('/reset-password/{token}', function ($token) {
    return response()->json(['token' => $token]);
})->name('password.reset');

Route::middleware(['auth:sanctum'])->group(function () {
    // Lấy danh sách tất cả người dùng (có thể truy cập bởi tất cả người dùng đã đăng nhập)
    Route::get('/users', [UserController::class, 'index']);
    // Các endpoint chỉ dành cho admin
    Route::middleware(['admin'])->group(function () {
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']); // Create user
        Route::put('/users/{id}', [UserController::class, 'update']); // Update user
        Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete user
        Route::get('/users/trashed/all', [UserController::class, 'getTrashed']);
        Route::put('/users/restore/{id}', [UserController::class, 'restore']);
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/messages', [ChatController::class, 'sendMessage']);
    Route::get('/messages/{user_id}', [ChatController::class, 'getMessages']);
    Route::get('/chats', [ChatController::class, 'getChats']);
});