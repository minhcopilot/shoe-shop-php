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
    $googleUser = Socialite::driver('google')->user();

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    $existingUser = User::where('email', $googleUser->email)->first();

    if ($existingUser) {
        // Nếu email đã tồn tại, kiểm tra xem google_id đã được liên kết chưa
        if (!$existingUser->google_id) {
            // Cập nhật google_id nếu chưa được liên kết
            $existingUser->update([
                'google_id' => $googleUser->id,
            ]);
        }

        // Nếu người dùng chưa có mật khẩu, tạo mật khẩu mặc định
        if (is_null($existingUser->password)) {
            $existingUser->update([
                'password' => bcrypt('12345678'),
            ]);
        }
        // Tạo token
        $token = $existingUser->createToken('user')->plainTextToken;
        $user = $existingUser;

        // Chuyển hướng về frontend và kèm token và user
        return redirect('http://localhost:3000' . '/?token=' . $token . '&user=' . urlencode(json_encode($user)));
    }

    // Nếu email chưa tồn tại, tạo người dùng mới
    $user = User::create([
        'google_id' => $googleUser->id,
        'name' => $googleUser->name,
        'email' => $googleUser->email,
        'password' => bcrypt('12345678'),
        'email_verified_at' => now(),
    ]);

    // Tạo token
    $token = $user->createToken('user')->plainTextToken;

    // Chuyển hướng về frontend và kèm token và user
    return redirect('http://localhost:3000' . '/?token=' . $token . '&user=' . urlencode(json_encode($user)));
});


