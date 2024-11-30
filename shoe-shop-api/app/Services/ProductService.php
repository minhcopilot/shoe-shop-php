<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductService
{
    public function getProducts($search = null)
    {
        $query = Product::with(['category', 'sizes']);

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        return $query->paginate(100);
    }

    public function createProduct($data)
    {
        return DB::transaction(function () use ($data) {
            $images = $this->uploadImages($data['images'] ?? []);
            $product = Product::create(array_merge($data, ['images' => $images]));

            if (!empty($data['sizes'])) {
                $product->sizes()->sync($data['sizes']);
            }

            return $product;
        });
    }

    public function updateProduct(Product $product, $data)
{
    return DB::transaction(function () use ($product, $data) {
        // Nếu có hình ảnh, xử lý upload
        if (isset($data['images'])) {
            $newImages = $this->uploadImages($data['images']);
            $data['images'] = array_merge($product->images ?? [], $newImages);
        }

        // Cập nhật sản phẩm với các dữ liệu đã xác thực
        $product->update($data);  // Truyền mảng dữ liệu vào

        // Cập nhật lại danh sách kích cỡ (nếu có)
        if (!empty($data['sizes'])) {
            $product->sizes()->sync($data['sizes']);
        }

        return $product;
    });
}
    public function deleteProduct($product)
    {
        $product->delete();
    }

    public function restoreProduct($id)
    {
        $product = Product::onlyTrashed()->findOrFail($id);
        $product->restore();
        return $product;
    }

    public function getTrashedProducts()
    {
        return Product::onlyTrashed()->with(['category', 'sizes'])->get();
    }

    private function uploadImages($images)
    {
        $urls = [];
        foreach ($images as $image) {
            $uploadedFileUrl = Cloudinary::upload($image->getRealPath(), [
                'folder' => 'products' // Thay đổi 'products' bằng thư mục mong muốn trên Cloudinary
            ])->getSecurePath();
            $urls[] = $uploadedFileUrl;
        }
        return $urls;
    }

}
