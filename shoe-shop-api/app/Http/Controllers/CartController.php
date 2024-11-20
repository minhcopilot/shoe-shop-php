<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Lấy giỏ hàng của người dùng
    // public function index(Request $request)
    // {
    //     $user = $request->user();
    //     $carts = $user->carts()->with('product', 'size')->get();
    //     return response()->json($carts);
    // }
    public function index(Request $request)
    {
        // Lấy người dùng từ request (tạm thời bỏ auth để dễ test)
        // Cần bổ sung logic để nhận người dùng từ token nếu có
        $user = User::find(1); // Lấy người dùng có ID = 1 (dùng cho test)

        // Trả về giỏ hàng của người dùng
        if ($user) {
            $carts = $user->cart; // Giả sử bạn lưu giỏ hàng trong thuộc tính `cart` của User model
            return response()->json($carts);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'size_id' => 'required|exists:sizes,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        // Kiểm tra xem sản phẩm và kích thước đã có trong giỏ hàng chưa
        $cart = $user->carts()->where('product_id', $validated['product_id'])
                               ->where('size_id', $validated['size_id'])
                               ->first();

        if ($cart) {
            // Nếu có thì cập nhật số lượng
            $cart->update(['quantity' => $cart->quantity + $validated['quantity']]);
        } else {
            // Nếu chưa có thì thêm vào giỏ hàng
            $user->carts()->create($validated);
        }

        return response()->json(['message' => 'Product added to cart']);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $cart = $user->carts()->findOrFail($id);

        // Cập nhật số lượng sản phẩm
        $cart->update(['quantity' => $validated['quantity']]);

        return response()->json(['message' => 'Cart updated']);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $cart = $user->carts()->findOrFail($id);

        $cart->delete();

        return response()->json(['message' => 'Product removed from cart']);
    }
}
