<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Size;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Lấy giỏ hàng của người dùng
    public function getCart(Request $request)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
            ->with(['product', 'size'])
            ->get();

        if ($cart->isEmpty()) {
            return response()->json([
                'message' => 'Giỏ hàng trống.',
                'cart' => [],
                'error' => false,
            ], 200);
        }

        return response()->json([
            'cart' => $cart,
            'error' => false,
        ], 200);
    }

    // Thêm sản phẩm vào giỏ hàng
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'size_id' => 'required|exists:sizes,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        $existingItem = Cart::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('size_id', $request->size_id)
            ->first();

        if ($existingItem) {
            $existingItem->quantity += $request->quantity;
            $existingItem->save();
        } else {
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'size_id' => $request->size_id,
                'quantity' => $request->quantity,
            ]);
        }

        $this->updateUserCart($user);

        return response()->json([
            'message' => 'Sản phẩm đã được thêm vào giỏ hàng.',
            'cart' => $user->cart,
            'error' => false,
        ], 201);
    }

    // Cập nhật sản phẩm trong giỏ hàng
    public function updateCart(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|exists:carts,id',
            'quantity' => 'required|integer|min:1',
            'size_id' => 'nullable|exists:sizes,id',
        ]);

        $user = Auth::user();

        $cart = Cart::where('id', $request->cart_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng.',
                'error' => true,
            ], 404);
        }

        if ($request->size_id && $request->size_id != $cart->size_id) {
            $existingItem = Cart::where('user_id', $user->id)
                ->where('product_id', $cart->product_id)
                ->where('size_id', $request->size_id)
                ->first();

            if ($existingItem) {
                $existingItem->quantity += $request->quantity;
                $existingItem->save();
                $cart->delete();

                $this->updateUserCart($user);

                return response()->json([
                    'message' => 'Cập nhật kích thước sản phẩm và hợp nhất số lượng thành công.',
                    'cart' => $user->cart,
                    'error' => false,
                ]);
            }

            $cart->size_id = $request->size_id;
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        $this->updateUserCart($user);

        return response()->json([
            'message' => 'Giỏ hàng đã được cập nhật.',
            'cart' => $user->cart,
            'error' => false,
        ]);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function removeFromCart(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|exists:carts,id',
        ]);

        $user = Auth::user();

        $cartItem = Cart::where('id', $request->cart_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Không tìm thấy sản phẩm trong giỏ hàng.',
                'error' => true,
            ], 404);
        }

        $cartItem->delete();

        $this->updateUserCart($user);

        return response()->json([
            'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng.',
            'cart' => $user->cart,
            'error' => false,
        ]);
    }

    // Hàm cập nhật JSON giỏ hàng trong cột 'cart' của user
    private function updateUserCart(User $user)
    {
        $cartItems = Cart::where('user_id', $user->id)
            ->with(['product:id,name', 'size:id,name'])
            ->get(['product_id', 'size_id', 'quantity']);

        $userCart = $cartItems->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'size_id' => $item->size_id,
                'quantity' => $item->quantity,
                'product_name' => $item->product->name ?? null,
                'size_name' => $item->size->name ?? null,
            ];
        })->toArray();

        $user->update(['cart' => $userCart]);
    }
}
