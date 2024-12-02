<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Size;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }


    public function createOrder(Request $request)
    {
        // Validate dữ liệu đầu vào
        $request->validate([
            'payment_method' => 'required|string|in:Tiền mặt,MOMO,Thẻ ngân hàng', // Chỉ chấp nhận 3 phương thức thanh toán
            'address' => 'required|string',
            'status' => 'nullable|string|in:Chờ xác nhận,Đã xác nhận,Đang Giao hàng,Huỷ,Thành công',
            'sdt' => ['required', 'string', 'regex:/^\d{10}$/'],  // Validate số điện thoại (10 chữ số)
            'cart_items' => 'required|array', // Yêu cầu cart_items phải là một mảng
            'cart_items.*.product_id' => 'required|exists:products,id', // Mỗi sản phẩm phải tồn tại trong bảng products
            'cart_items.*.quantity' => 'required|integer|min:1', // Số lượng sản phẩm >= 1
            'cart_items.*.size_id' => 'nullable|exists:sizes,id', // Kích cỡ (nếu có) phải tồn tại
        ]);

        $user = Auth::user();

        // Tính tổng giá trị đơn hàng từ cart_items
        $totalPrice = 0;
        foreach ($request->cart_items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $totalPrice += $product->price * $item['quantity'];
        }

        // Xử lý trạng thái đơn hàng (mặc định là 'Chờ xác nhận')
        $status = $request->status ?? 'Chờ xác nhận';

        // Xử lý theo phương thức thanh toán
        if ($request->payment_method === 'MOMO') {
            // Logic xử lý MOMO nếu cần
            // Ví dụ: gọi API MOMO hoặc xác thực thanh toán
        }

        // Tạo đơn hàng mới
        $order = Order::create([
            'user_id' => $user->id,
            'total_price' => $totalPrice,
            'payment_method' => $request->payment_method,
            'status' => $status,
            'address' => $request->address,
            'sdt' => $request->sdt,
        ]);

        // Tạo OrderItem từ cart_items trong request
        foreach ($request->cart_items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $size = Size::find($item['size_id']); // Có thể null nếu không có size

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'size_id' => $item['size_id'] ?? null, // Nếu size_id không có, để null
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);
        }

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order,
            'error' => false,
        ], 201);
    }

    // public function updateOrderStatus(Request $request, $orderId)
    // {
    //     // Lấy user hiện tại
    //     $user = Auth::user();
    
    //     // Lấy đơn hàng theo `orderId`, kiểm tra quyền truy cập
    //     $order = Order::findOrFail($orderId);
    //     if (!$user->is_admin && $order->user_id !== $user->id) {
    //         return response()->json([
    //             'message' => 'Bạn không có quyền cập nhật đơn hàng này.',
    //             'error' => true,
    //         ], 403);
    //     }
    
    //     // Xác thực dữ liệu đầu vào
    //     $validatedData = $request->validate([
    //         'address' => 'required_if:is_admin,false|string|max:255', // User cần cung cấp địa chỉ
    //         'sdt' => ['nullable', 'string', 'regex:/^\d{10}$/'],      // Số điện thoại (tùy chọn, phải là 10 chữ số)
    //         'status' => 'nullable|string|in:Chờ xác nhận,Đã xác nhận,Đang giao hàng,Huỷ,Thành công', // Trạng thái hợp lệ (tùy chọn)
    //     ]);
    
    //     // Kiểm tra quyền admin
    //     if ($user->is_admin) {
    //         // Admin được phép cập nhật mọi trạng thái
    //         if ($request->has('status')) {
    //             $order->status = $request->status;
    //         }
    //     } else {
    //         // User chỉ có thể thay đổi trạng thái thành "Huỷ"
    //         if ($request->has('status') && $request->status == 'Huỷ') {
    //             $order->status = 'Huỷ';
    //         } else {
    //             return response()->json([
    //                 'message' => 'Bạn chỉ có thể huỷ đơn hàng.',
    //                 'error' => true,
    //             ], 403);
    //         }
    
    //         // User chỉ được phép cập nhật địa chỉ và số điện thoại
    //         if ($request->has('address')) {
    //             $order->address = $validatedData['address'];
    //         }
    //         if ($request->has('sdt')) {
    //             $order->sdt = $validatedData['sdt'];
    //         }
    //     }
    
    //     // Lưu đơn hàng
    //     $order->save();
    
    //     return response()->json([
    //         'message' => 'Cập nhật trạng thái đơn hàng thành công.',
    //         'order' => $order,
    //     ], 200);
    // }
    // Cập nhật trạng thái đơn hàng
public function updateOrderStatus(Request $request, $orderId)
{
    // Lấy user hiện tại
    $user = Auth::user();
    
    // Lấy đơn hàng theo `orderId`, kiểm tra quyền truy cập
    $order = Order::findOrFail($orderId);
    
    if (!$user->is_admin && $order->user_id !== $user->id) {
        return response()->json([
            'message' => 'Bạn không có quyền cập nhật đơn hàng này.',
            'error' => true,
        ], 403);
    }

    // Xác thực dữ liệu đầu vào
    $validatedData = $request->validate([
        'status' => 'nullable|string|in:Chờ xác nhận,Đã xác nhận,Đang giao hàng,Huỷ,Thành công', // Trạng thái hợp lệ (tùy chọn)
    ]);
    
    if ($user->is_admin) {
        // Admin được phép cập nhật mọi trạng thái
        if ($request->has('status')) {
            $order->status = $request->status;
        }
    } else {
        // User chỉ có thể thay đổi trạng thái thành "Huỷ"
        if ($request->has('status') && $request->status == 'Huỷ') {
            $order->status = 'Huỷ';
        } else {
            return response()->json([
                'message' => 'Bạn chỉ có thể huỷ đơn hàng.',
                'error' => true,
            ], 403);
        }
    }

    // Lưu đơn hàng
    $order->save();

    return response()->json([
        'message' => 'Cập nhật trạng thái đơn hàng thành công.',
        'order' => $order,
    ], 200);
}

// Cập nhật địa chỉ và số điện thoại
public function updateOrderDetails(Request $request, $orderId)
{
    // Lấy user hiện tại
    $user = Auth::user();
    
    // Lấy đơn hàng theo `orderId`, kiểm tra quyền truy cập
    $order = Order::findOrFail($orderId);
    
    // Kiểm tra quyền truy cập của người dùng
    if (!$user->is_admin && $order->user_id !== $user->id) {
        return response()->json([
            'message' => 'Bạn không có quyền cập nhật đơn hàng này.',
            'error' => true,
        ], 403);
    }

    // Xác thực dữ liệu đầu vào
    $validatedData = $request->validate([
        'address' => 'required_if:is_admin,false|string|max:255', // User cần cung cấp địa chỉ
        'sdt' => ['nullable', 'string', 'regex:/^\d{10}$/'],      // Số điện thoại (tùy chọn, phải là 10 chữ số)
    ]);
    
    // Admin có thể thay đổi địa chỉ và số điện thoại của bất kỳ đơn hàng nào
    if ($user->is_admin) {
        if ($request->has('address')) {
            $order->address = $validatedData['address'];
        }
        if ($request->has('sdt')) {
            $order->sdt = $validatedData['sdt'];
        }
    } else {
        // User chỉ được phép thay đổi địa chỉ và số điện thoại của chính mình
        if ($request->has('address')) {
            $order->address = $validatedData['address'];
        }
        if ($request->has('sdt')) {
            $order->sdt = $validatedData['sdt'];
        }
    }

    // Lưu đơn hàng
    $order->save();

    return response()->json([
        'message' => 'Cập nhật thông tin đơn hàng thành công.',
        'order' => $order,
    ], 200);
}





    public function getOrderHistory()
    {
        $user = Auth::user();

        if ($user->is_admin) {
            // Admin có thể lấy tất cả đơn hàng
            $orders = Order::with('orderItems.product', 'orderItems.size')->get();
        } else {
            // User chỉ có thể lấy đơn hàng của chính mình
            $orders = Order::where('user_id', $user->id)
                ->with('orderItems.product', 'orderItems.size')
                ->get();
        }

        return response()->json([
            'orders' => $orders,
            'error' => false,
        ]);
    }

    // Get Order Detail
    public function getOrderDetail($orderId)
    {
        $user = Auth::user();

        // Tìm đơn hàng theo ID và thuộc về người dùng hiện tại
        $order = Order::where('user_id', $user->id)
            ->with('orderItems.product', 'orderItems.size') // Tải thông tin sản phẩm và kích thước
            ->findOrFail($orderId); // Nếu không tìm thấy đơn hàng thì trả về lỗi 404

        // Chuyển đổi các orderItems để hiển thị thông tin chi tiết về sản phẩm và kích thước
        $order->orderItems->transform(function ($item) {
            $item->product_name = $item->product->name;   // Thêm tên sản phẩm vào OrderItem
            $item->size_name = $item->size->name;          // Thêm tên kích thước vào OrderItem
            $item->price = $item->product->price;          // Thêm giá sản phẩm vào OrderItem
            $item->image = $item->product->images;          // Thêm ảnh sản phẩm vào OrderItem
            $item->quantity = $item->quantity;
            $item->sdt = $item->sdt;
            return $item;
        });

        return response()->json([
            'order' => $order,
            'error' => false,
        ]);
    }

    // Delete Order
    public function deleteOrder($orderId)
    {
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->findOrFail($orderId);

        // Xóa đơn hàng và các mục liên quan
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully.',
            'error' => false,
        ]);
    }

    // Search Orders by Status
    public function searchOrders(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $request->validate([
            'status' => 'required|string',
        ]);

        // Lấy người dùng đang đăng nhập
        $user = Auth::user();

        // Tìm kiếm đơn hàng của người dùng theo trạng thái
        $orders = Order::where('user_id', $user->id)
            ->where('status', $request->status)
            ->with('orderItems.product', 'orderItems.size')
            ->get();

        // Trả về kết quả
        return response()->json([
            'orders' => $orders,
            'error' => false,
        ]);
    }


    // Update User Cart
    private function updateUserCart(User $user)
    {
        // Cập nhật giỏ hàng trong thông tin người dùng
        $user->update(['cart' => []]);
    }
}
