<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
// Route::get('/reset-password/{token}', function ($token) {
//     return view('auth.reset-password', ['token' => $token]);
// })->name('password.reset');

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
});

Route::get('/auth/google/callback', function () {
    $gooleUser = Socialite::driver('google')->user();

    $user = User::updateOrCreate(
        [
            'google_id' => $gooleUser->id
        ],
        [
            'name' => $gooleUser->name,
            'email'=> $gooleUser->email,
            'password' => Hash::make('12345678'),
            'email_verified_at' => now()
        ]
        );
    // Đăng nhập người dùng
    auth()->login($user);

    // Chuyển hướng về trang chủ hoặc trang bất kỳ
    return redirect('/home')->with('success', 'Logged in successfully using Google!');
});