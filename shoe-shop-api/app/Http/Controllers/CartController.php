<?php


// namespace App\Http\Controllers;

// use App\Models\Cart;
// use App\Models\Product;
// use App\Models\Size;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;

// class CartController extends Controller
// {
//     // Constructor để áp dụng middleware cho xác thực người dùng
//     public function __construct()
//     {
//         $this->middleware('auth:sanctum');
//     }

//     // Lấy các sản phẩm trong giỏ hàng của người dùng đã đăng nhập
//     public function getCart(Request $request)
//     {
//         // Lấy thông tin người dùng hiện tại
//         $user = Auth::user();

//         // Lấy các sản phẩm trong giỏ hàng của người dùng
//         $cart = Cart::where('user_id', $user->id)
//                     ->with(['product', 'size']) // Tải dữ liệu sản phẩm và kích thước liên quan
//                     ->get();

//         // Nếu giỏ hàng trống, trả về thông báo
//         if ($cart->isEmpty()) {
//             return response()->json([
//                 'message' => 'Giỏ hàng trống.',
//                 'error' => false
//             ], 200); 
//         }

//         // Trả về các sản phẩm trong giỏ hàng
//         return response()->json([
//             'cart' => $cart,
//             'error' => false
//         ], 200);  
//     }

//     // Thêm sản phẩm vào giỏ hàng
//     public function addToCart(Request $request)
//     {
//         // Kiểm tra tính hợp lệ của dữ liệu yêu cầu
//         $request->validate([
//             'product_id' => 'required|exists:products,id',
//             'size_id' => 'required|exists:sizes,id',
//             'quantity' => 'required|integer|min:1',
//         ]);

//         // Lấy thông tin người dùng đã xác thực
//         $user = Auth::user();

//         // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
//         $existingItem = Cart::where('user_id', $user->id)
//                             ->where('product_id', $request->product_id)
//                             ->where('size_id', $request->size_id)
//                             ->first();

//         // Nếu sản phẩm đã có, cập nhật số lượng
//         if ($existingItem) {
//             $existingItem->quantity += $request->quantity;
//             $existingItem->save();
//         } else {
//             // Nếu sản phẩm chưa có, tạo mới một mục giỏ hàng
//             Cart::create([
//                 'user_id' => $user->id,
//                 'product_id' => $request->product_id,
//                 'size_id' => $request->size_id,
//                 'quantity' => $request->quantity
//             ]);
//         }

//         // Trả về thông báo thành công
//         return response()->json([
//             'message' => 'Sản phẩm đã được thêm vào giỏ hàng.',
//             'error' => false
//         ], 201);
//     }

//     // Cập nhật số lượng hoặc kích thước sản phẩm trong giỏ hàng
//     public function updateCart(Request $request)
//     {
//         // Kiểm tra tính hợp lệ của dữ liệu yêu cầu
//         $request->validate([
//             'cart_id' => 'required|exists:carts,id',
//             'quantity' => 'required|integer|min:1',
//             'size_id' => 'nullable|exists:sizes,id',
//         ]);

//         // Lấy thông tin người dùng đã xác thực
//         $user = Auth::user();

//         // Lấy sản phẩm trong giỏ hàng cần cập nhật
//         $cart = Cart::where('id', $request->cart_id)
//                     ->where('user_id', $user->id)
//                     ->first();

//         // Nếu sản phẩm trong giỏ hàng không tồn tại, trả về lỗi
//         if (!$cart) {
//             return response()->json([
//                 'message' => 'Không tìm thấy sản phẩm trong giỏ hàng.',
//                 'error' => true
//             ], 404);
//         }

//         // Xử lý thay đổi kích thước sản phẩm và hợp nhất số lượng
//         if ($request->size_id && $request->size_id != $cart->size_id) {
//             $existingItem = Cart::where('user_id', $user->id)
//                                 ->where('product_id', $cart->product_id)
//                                 ->where('size_id', $request->size_id)
//                                 ->first();

//             // Nếu đã có sản phẩm với kích thước mới, hợp nhất số lượng
//             if ($existingItem) {
//                 $existingItem->quantity += $request->quantity;
//                 $existingItem->save();

//                 // Xóa sản phẩm cũ trong giỏ hàng
//                 $cart->delete();

//                 return response()->json([
//                     'message' => 'Cập nhật kích thước sản phẩm và hợp nhất số lượng thành công.',
//                     'cart' => $existingItem,
//                     'error' => false
//                 ]);
//             }

//             // Cập nhật kích thước sản phẩm trong giỏ hàng
//             $cart->size_id = $request->size_id;
//         }

//         // Cập nhật số lượng sản phẩm trong giỏ hàng
//         $cart->quantity = $request->quantity;
//         $cart->save();

//         return response()->json([
//             'message' => 'Giỏ hàng đã được cập nhật.',
//             'cart' => $cart,
//             'error' => false
//         ]);
//     }

//     // Xóa sản phẩm khỏi giỏ hàng
//     public function removeFromCart(Request $request)
//     {
//         // Kiểm tra tính hợp lệ của dữ liệu yêu cầu
//         $request->validate([
//             'cart_id' => 'required|exists:carts,id',
//         ]);

//         // Lấy thông tin người dùng đã xác thực
//         $user = Auth::user();

//         // Lấy sản phẩm trong giỏ hàng cần xóa
//         $cartItem = Cart::where('id', $request->cart_id)
//                         ->where('user_id', $user->id)
//                         ->first();

//         // Nếu sản phẩm không tồn tại trong giỏ hàng, trả về lỗi
//         if (!$cartItem) {
//             return response()->json([
//                 'message' => 'Không tìm thấy sản phẩm trong giỏ hàng.',
//                 'error' => true
//             ], 404);
//         }

//         // Xóa sản phẩm khỏi giỏ hàng
//         $cartItem->delete();

//         return response()->json([
//             'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng.',
//             'error' => false
//         ]);
//     }
// }

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function getCart(Request $request)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)
                    ->with(['product', 'size'])
                    ->get();

        if ($cart->isEmpty()) {
            return response()->json([
                'message' => 'Giỏ hàng trống.',
                'error' => false,
            ], 200);
        }

        return response()->json([
            'cart' => $cart,
            'error' => false,
        ], 200);
    }

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

        return response()->json([
            'message' => 'Sản phẩm đã được thêm vào giỏ hàng.',
            'error' => false,
        ], 201);
    }

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

                return response()->json([
                    'message' => 'Cập nhật kích thước sản phẩm và hợp nhất số lượng thành công.',
                    'cart' => $existingItem,
                    'error' => false,
                ]);
            }

            $cart->size_id = $request->size_id;
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json([
            'message' => 'Giỏ hàng đã được cập nhật.',
            'cart' => $cart,
            'error' => false,
        ]);
    }

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

        return response()->json([
            'message' => 'Sản phẩm đã được xóa khỏi giỏ hàng.',
            'error' => false,
        ]);
    }
}

