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
        // $params['password'] = Hash::make($params['password']);

        return $this->user->create($params);
    }

    public function login($params)
    {
        $user = $this->user->where('email', $params['email'])->first();

        $checkPassword = Hash::check($params['password'], $user->password);

        if (!$checkPassword) {
            return [
                'message' => 'Email or password is incorrect',
                'code' => 401,
            ];
        }

        return [
            'message' => 'Login success',
            'code' => 200,
            'access_token' => $user->access_token,
        ];
    }
}