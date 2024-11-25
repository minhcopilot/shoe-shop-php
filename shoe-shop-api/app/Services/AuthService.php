<?php
namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class AuthService
{
    protected $user;
    public function __construct(User $user)
    {
        $this->user = $user;
    }
    public function register($params)
    {
        $user = $this->user->create($params);

        // Gửi email xác thực
        $user->sendEmailVerificationNotification();

        // Tạo token cho người dùng
        $token = $user->createToken('user')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function login($params)
    {
        $user = $this->user->where('email', $params['email'])->first();

        if (!$user || !Hash::check($params['password'], $user->password)) {
            return [
                'message' => 'Email or password is incorrect',
                'code' => 401,
            ];
        }

        // Tạo token mới cho user
        $token = $user->createToken('user')->plainTextToken;

        return [
            'message' => 'Login success',
            'code' => 200,
            'token' => $token,
            'user' => $user,
        ];
    }

    public function logout()
    {
        return auth()->user()->tokens()->delete();
    }
}