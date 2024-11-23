<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Size;
use App\Models\User;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        if (!$request->has('user_id')) {
            return response()->json([
                'message' => 'Missing required parameter: user_id.',
                'error' => true
            ], 400);  
        }
    
        $userId = $request->query('user_id');
    
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'error' => true
            ], 404);  
        }
    
        $cart = Cart::where('user_id', $userId)
                    ->with(['product', 'size'])
                    ->get();
    
        if ($cart->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty.',
                'error' => false
            ], 200); 
        }
    
        return response()->json([
            'cart' => $cart,
            'error' => false
        ], 200);  
    }

    public function addToCart(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'product_id' => 'required|exists:products,id',
        'size_id' => 'required|exists:sizes,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $user = User::find($request->input('user_id'));

    if (!$user) {
        return response()->json([
            'message' => 'User not found',
            'error' => true
        ], 404);
    }

    $existingItem = Cart::where('user_id', $request->user_id)
                        ->where('product_id', $request->product_id)
                        ->where('size_id', $request->size_id)
                        ->first();

    if ($existingItem) {
        $existingItem->quantity += $request->quantity;
        $existingItem->save();
    } else {
        Cart::create([
            'user_id' => $request->user_id,
            'product_id' => $request->product_id,
            'size_id' => $request->size_id,
            'quantity' => $request->quantity
        ]);
    }


    $this->updateUserCart($user);

    return response()->json([
        'message' => 'Product added to cart successfully.',
        'error' => false
    ], 201);
}

public function updateCart(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'cart_id' => 'required|exists:carts,id',
        'quantity' => 'required|integer|min:1',
        'size_id' => 'nullable|exists:sizes,id',
    ]);

    $cart = Cart::where('id', $request->cart_id)
                ->where('user_id', $request->user_id)
                ->first();

    if (!$cart) {
        return response()->json([
            'message' => 'Cart item not found for this user',
            'error' => true
        ], 404);
    }

    if ($request->size_id && $request->size_id != $cart->size_id) {
        $existingItem = Cart::where('user_id', $request->user_id)
                            ->where('product_id', $cart->product_id)
                            ->where('size_id', $request->size_id)
                            ->first();

        if ($existingItem) {
            $existingItem->quantity += $request->quantity;
            $existingItem->save();

            $cart->delete();

            $user = User::find($request->user_id);
            $this->updateUserCart($user);

            return response()->json([
                'message' => 'Product size updated and quantity merged successfully.',
                'cart' => $existingItem,
                'error' => false
            ]);
        } else {
            $cart->size_id = $request->size_id;
            $cart->quantity = $request->quantity;
            $cart->save();

            $user = User::find($request->user_id);
            $this->updateUserCart($user);

            return response()->json([
                'message' => 'Product size and quantity updated successfully.',
                'cart' => $cart,
                'error' => false
            ]);
        }
    }

    $cart->quantity = $request->quantity;
    $cart->save();


    $user = User::find($request->user_id);
    $this->updateUserCart($user);

    return response()->json([
        'message' => 'Product quantity updated successfully.',
        'cart' => $cart,
        'error' => false
    ]);
}

public function removeFromCart(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'cart_id' => 'required|exists:carts,id',
    ]);

    $user = User::find($request->user_id);

    if (!$user) {
        return response()->json([
            'message' => 'User not found.',
            'error' => true
        ], 404);
    }

    $cartItem = Cart::where('user_id', $request->user_id)
                    ->where('id', $request->cart_id)
                    ->first();

    if (!$cartItem) {
        return response()->json([
            'message' => 'Product not found in cart for this user.',
            'error' => true
        ], 404);
    }


    $cartItem->delete();
    $this->updateUserCart($user);

    return response()->json([
        'message' => 'Product removed from cart successfully.',
        'error' => false
    ]);
}
    private function updateUserCart(User $user)
{

    $cartItems = Cart::where('user_id', $user->id)
                     ->get(['product_id', 'size_id', 'quantity']);

    $userCart = $cartItems->map(function ($item) {
        return [
            'product_id' => $item->product_id,
            'size_id' => $item->size_id,
            'quantity' => $item->quantity
        ];
    })->toArray();

    $user->cart = $userCart;
    $user->save();
}
}
