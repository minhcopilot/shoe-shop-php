<?php
namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Api\Auth\LoginRequest;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Api\Auth\RegisterRequest;
use App\Models\User;

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

    // Gửi email chứa link đặt lại mật khẩu
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Reset link sent to your email.']);
        }

        return response()->json(['message' => 'Unable to send reset link.'], 500);
    }

    // Xử lý reset mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully.']);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function getUser(Request $request)
    {
        // Lấy thông tin người dùng từ access token
        $user = $request->user();

        if ($user) {
            return response()->json([
                'status' => 200,
                'message' => 'User retrieved successfully',
                'data' => $user,
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Unauthenticated',
        ], 401);
    }
}