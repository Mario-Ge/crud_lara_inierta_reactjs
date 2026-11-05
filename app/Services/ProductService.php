<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    /**
     * Get paginated products with optional search and category filter.
     */
    public function paginate(
        ?string $search = null,
        ?int $categoryId = null
    ): LengthAwarePaginator {
        $query = Product::query()
            ->with('category')
            ->latest();

        // Search by product name or SKU.
        if ($search !== null && trim($search) !== '') {
            $search = trim($search);

            $query->where(function (Builder $query) use ($search): void {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Filter by category.
        if ($categoryId !== null) {
            $query->where('category_id', $categoryId);
        }

        return $query->paginate(10)->withQueryString();
    }

    /**
     * Store a new product.
     *
     * @param array<string, mixed> $data
     */
    public function store(array $data): Product
    {
        /** @var UploadedFile|null $image */
        $image = $data['image'] ?? null;

        // Remove image from data because it is not a database column.
        unset($data['image']);

        // Store the image before inserting the product.
        $imagePath = $this->storeImage($image);

        try {
            $product = new Product();

            $product->fill($data);

            if ($imagePath !== null) {
                $product->image_path = $imagePath;
            }

            // Check whether database insertion succeeds.
            if (!$product->save()) {
                throw new \RuntimeException('Failed to save product.');
            }

            return $product;
        } catch (\Throwable $exception) {
            // Remove the newly uploaded image if database save fails.
            if ($imagePath !== null) {
                $this->deleteStoredImage($imagePath);
            }

            // Rethrow the original exception.
            throw $exception;
        }
    }

    /**
     * Update an existing product.
     *
     * @param array<string, mixed> $data
     */
    public function update(Product $product, array $data): Product
    {
        /** @var UploadedFile|null $image */
        $image = $data['image'] ?? null;

        // Remove image from data because it is not a database column.
        unset($data['image']);

        $oldImagePath = $product->image_path;

        // Store a replacement image if provided.
        $newImagePath = $this->storeImage($image);

        try {
            $product->fill($data);

            if ($newImagePath !== null) {
                $product->image_path = $newImagePath;
            }

            // Check whether database update succeeds.
            if (!$product->save()) {
                throw new \RuntimeException('Failed to update product.');
            }
        } catch (\Throwable $exception) {
            // Keep the old image if database update fails.
            if ($newImagePath !== null) {
                $this->deleteStoredImage($newImagePath);
            }

            // Rethrow the original exception.
            throw $exception;
        }

        // Delete the old image only after database update succeeds.
        if ($newImagePath !== null && $oldImagePath !== null) {
            $this->deleteStoredImage($oldImagePath);
        }

        return $product;
    }

    /**
     * Delete a product and its associated image.
     */
    public function delete(Product $product): void
    {
        $imagePath = $product->image_path;

        // Delete the database record first.
        if (!$product->delete()) {
            throw new \RuntimeException('Failed to delete product.');
        }

        // Delete the image only after database deletion succeeds.
        if ($imagePath !== null) {
            $this->deleteStoredImage($imagePath);
        }
    }

    /**
     * Store a product image on the public disk.
     */
    private function storeImage(?UploadedFile $image): ?string
    {
        if ($image === null) {
            return null;
        }

        $path = $image->store('products', 'public');

        if ($path === false) {
            throw new \RuntimeException('Failed to store product image.');
        }

        return $path;
    }

    /**
     * Delete an image and log failures for later cleanup.
     */
    private function deleteStoredImage(string $path): void
    {
        try {
            $deleted = Storage::disk('public')->delete($path);

            if (!$deleted) {
                Log::warning('Failed to delete product image.', [
                    'path' => $path,
                ]);
            }
        } catch (\Throwable $exception) {
            Log::warning('Exception while deleting product image.', [
                'path' => $path,
                'exception' => $exception->getMessage(),
            ]);
        }
    }
}
