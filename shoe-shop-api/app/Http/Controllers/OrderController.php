<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Size;
use App\Models\Cart;
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
            'payment_method' => 'required|string',
            'address' => 'required|string',
            'status' => 'nullable|string|in:Chờ xác nhận,Đã xác nhận,Đang giao hàng,Huỷ',
        ]);

        $user = Auth::user();

        // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
        $cartItems = Cart::where('user_id', $user->id)->get();

        // Kiểm tra xem giỏ hàng có sản phẩm không
        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty.',
                'error' => true,
            ], 400);
        }

        // Tính tổng giá trị đơn hàng
        $totalPrice = 0;
        foreach ($cartItems as $item) {
            $product = Product::findOrFail($item->product_id);
            $totalPrice += $product->price * $item->quantity;
        }

        // Xử lý trạng thái đơn hàng (mặc định là 'Chờ xác nhận')
        $status = $request->status ?? 'Chờ xác nhận';

        // Tạo đơn hàng mới
        $order = Order::create([
            'user_id' => $user->id,
            'total_price' => $totalPrice,
            'payment_method' => $request->payment_method,
            'status' => $status,  // Trạng thái được truyền vào request, mặc định là 'Chờ xác nhận'
            'address' => $request->address,
        ]);

        // Tạo OrderItem từ giỏ hàng
        foreach ($cartItems as $item) {
            $product = Product::findOrFail($item->product_id);
            $size = Size::findOrFail($item->size_id);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'size_id' => $item->size_id,
                'quantity' => $item->quantity,
                'price' => $product->price,
            ]);
        }

        // Sau khi tạo đơn hàng xong, xóa tất cả sản phẩm trong giỏ hàng
        Cart::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order,
            'error' => false,
        ], 201);
    }


    // Cập nhật đơn hàng
    public function updateOrderStatus(Request $request, $orderId)
    {
        $request->validate([
            'address' => 'required|string',
        ]);

        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->findOrFail($orderId);

        $order->address = $request->address;
        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully.',
            'order' => $order,
            'error' => false,
        ]);
    }

    // Xem lịch sử đơn hàng
    public function getOrderHistory()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
            ->with('orderItems.product', 'orderItems.size') // Load thông tin sản phẩm và size
            ->get();

        return response()->json([
            'orders' => $orders,
            'error' => false,
        ]);
    }

    public function getOrderDetail($orderId)
    {
        $user = Auth::user();

        // Tìm đơn hàng theo ID và thuộc về người dùng hiện tại
        $order = Order::where('user_id', $user->id)
            ->with('orderItems.product', 'orderItems.size') // Tải thông tin sản phẩm và kích thước
            ->findOrFail($orderId); // Nếu không tìm thấy đơn hàng thì trả về lỗi 404

        // Chuyển đổi các orderItems để hiển thị thông tin chi tiết về sản phẩm và kích thước
        $order->orderItems->transform(function ($item) {
            $item->product_name = $item->product->name;  // Thêm tên sản phẩm vào OrderItem
            $item->size_name = $item->size->name;        // Thêm tên kích thước vào OrderItem
            return $item;
        });

        return response()->json([
            'order' => $order,
            'error' => false,
        ]);
    }

    // Xóa đơn hàng
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

    // Tìm kiếm đơn hàng theo trạng thái
    public function searchOrders(Request $request)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
            ->where('status', $request->status)
            ->with('orderItems.product', 'orderItems.size')
            ->get();

        return response()->json([
            'orders' => $orders,
            'error' => false,
        ]);
    }
}
