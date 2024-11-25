<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\Product\UpdateRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use App\Models\Product;
use App\Classes\ApiResponse;
class ProductsController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        try {
            $products = $this->productService->getProducts(request('search'));
            return ApiResponse::sendResponse(ProductResource::collection($products), 'Products retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse::rollback($e, 'Failed to retrieve products');
        }
    }

    public function store(ProductRequest $request)
    {
        try {
            $product = $this->productService->createProduct($request->validated());
            return ApiResponse::sendResponse(new ProductResource($product), 'Product created successfully');
        } catch (\Exception $e) {
            return ApiResponse::rollback($e, 'Failed to create product');
        }
    }

    public function show($id)
    {
        try {
            $product = Product::with('sizes')->find($id);
            if (!$product) {
                return ApiResponse::NoSearch(null, 'Product not found');
            }
            return ApiResponse::sendResponse(new ProductResource($product), 'Product retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse::rollback($e, 'Failed to retrieve product');
        }
    }

    public function update(UpdateRequest $request, $id)
{
    try {
        $product = Product::find($id);
        if (!$product) {
            return ApiResponse::NoSearch(null, 'Product not found');
        }

        // Lấy dữ liệu đã xác thực và truyền vào updateProduct
        $updatedProduct = $this->productService->updateProduct($product, $request->validated());

        return ApiResponse::sendResponse(new ProductResource($updatedProduct), 'Product updated successfully');
    } catch (\Exception $e) {
        return ApiResponse::rollback($e, 'Failed to update product');
    }
}


    public function destroy($id)
    {
        try {
            $product = Product::find($id);
            if (!$product) {
                return ApiResponse::NoSearch(null, 'Product not found');
            }
            $this->productService->deleteProduct($product);
            return ApiResponse::sendResponse(null, 'Product deleted successfully');
        } catch (\Exception $e) {
            return ApiResponse::rollback($e, 'Failed to delete product');
        }
    }

    public function getTrashed()
    {
        try {
            $trashedProducts = $this->productService->getTrashedProducts();
            return ApiResponse::sendResponse(ProductResource::collection($trashedProducts), 'Trashed products retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse::rollback($e, 'Failed to retrieve trashed products');
        }
    }

    public function restore($id)
    {
        try {
            $restoredProduct = $this->productService->restoreProduct($id);
            if (!$restoredProduct) {
                return ApiResponse::NoSearch(null, 'Product not found or already restored');
            }
            return ApiResponse::sendResponse(new ProductResource($restoredProduct), 'Product restored successfully');
        } catch (\Exception $e) {
            return ApiResponse::rollback($e, 'Failed to restore product');
        }
    }
}
