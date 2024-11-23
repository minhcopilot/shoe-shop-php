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


=======
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

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

// // Xác thực email với route middleware
// Route::middleware('auth:sanctum')->get('/email/verify/{id}/{hash}', function ($id, $hash) {
//     $user = \App\Models\User::findOrFail($id);

//     // Kiểm tra hash email
//     if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
//         return response()->json(['message' => 'Invalid verification link.'], 403);
//     }

//     // Đánh dấu email là đã xác thực
//     if ($user->markEmailAsVerified()) {
//         event(new \Illuminate\Auth\Events\Verified($user));
//     }

//     return response()->json(['message' => 'Email verified successfully.']);
// })->name('verification.verify');

// Xác thực email
Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    $user = \App\Models\User::findOrFail($id);

    if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Invalid verification link.'], 403);
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

    return response()->json(['message' => 'Email verified successfully.']);
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

