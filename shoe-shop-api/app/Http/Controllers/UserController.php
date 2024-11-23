<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Lấy danh sách người dùng
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'message' => 'User retrieved successfully',
            'user' => $user
        ]);
    }

    // Tạo người dùng mới (chỉ admin)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'is_admin' => 'required|boolean',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update([
            'is_admin' => $request->is_admin,
        ]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }

    // Xóa người dùng (chỉ admin)
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
     // Endpoint để lấy danh sách người dùng đã xóa mềm
     public function getTrashed()
     {
         // Lấy tất cả người dùng đã bị xóa mềm
         $trashedUsers = User::onlyTrashed()->get();
 
         return response()->json([
             'message' => 'Trashed users retrieved successfully',
             'data' => $trashedUsers,
         ]);
     }
 
     // Endpoint để phục hồi người dùng đã bị xóa mềm
     public function restore($id)
     {
         // Tìm người dùng bị xóa mềm theo ID
         $user = User::withTrashed()->find($id);
 
         if (!$user) {
             return response()->json([
                 'message' => 'User not found',
             ], 404);
         }
 
         // Phục hồi người dùng
         $user->restore();
 
         return response()->json([
             'message' => 'User restored successfully',
             'data' => $user,
         ]);
     }
}
