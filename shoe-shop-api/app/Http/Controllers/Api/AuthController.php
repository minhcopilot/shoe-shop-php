<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
class AuthController extends Controller
{
    protected $authService;
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function register(RegisterRequest $registerRequest)
    {
        $params = $registerRequest->validated();
        $result = $this->authService->register($params);

        if ($result) {
            return response()->json([
                'message' => 'Register success',
                'user' => $result['user'],
                'access_token' => $result['access_token'],
            ]);
        }

        return response()->json(['message' => 'Register failed'], 400);
    }

    public function login(LoginRequest $loginRequest)
    {
        $params = $loginRequest->validated();
        $result = $this->authService->login($params);
        if ($result['code'] == 200) {
            return response()->api_success($result['message'], $result);
        }
        return response()->api_error($result['message'], $result['code']);
    }
    public function logout()
    {
        $result = $this->authService->logout();
        if ($result) {
            return response()->api_success('Logout success');
        }
        return response()->api_error('Logout failed');
    }
}