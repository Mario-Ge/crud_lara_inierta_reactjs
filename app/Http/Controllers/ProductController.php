<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Inject ProductService into the controller.
     */
    public function __construct(
        private readonly ProductService $productService,
    ) {
    }

    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response
    {
        // Get and sanitize search query.
        $searchInput = $request->query('search');

        $search = is_string($searchInput)
            ? trim($searchInput)
            : null;

        $search = $search === '' ? null : $search;

        // Get and validate category filter.
        $categoryId = null;
        $categoryIdInput = $request->query('category_id');

        if (is_string($categoryIdInput) || is_int($categoryIdInput)) {
            $parsedCategoryId = filter_var(
                $categoryIdInput,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]]
            );

            if ($parsedCategoryId !== false) {
                $categoryId = $parsedCategoryId;
            }
        }

        // Get paginated products from ProductService.
        $products = $this->productService->paginate(
            $search,
            $categoryId
        );

        // Transform products to include image URLs.
        $products->through(
            fn (Product $product): array => $this->productPayload($product)
        );

        return Inertia::render('products/Index', [
            'products' => $products,
            'categories' => $this->categoryOptions(),
            'filters' => [
                'search' => $search ?? '',
                'category_id' => $categoryId,
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('products/Create', [
            'categories' => $this->categoryOptions(),
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->productService->store($request->validated());

        Inertia::flash('success', 'Produk berhasil ditambahkan.');

        return to_route('products.index');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        $product->load('category');

        return Inertia::render('products/Edit', [
            'product' => $this->productPayload($product),
            'categories' => $this->categoryOptions(),
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(
        UpdateProductRequest $request,
        Product $product
    ): RedirectResponse {
        $this->productService->update(
            $product,
            $request->validated()
        );

        Inertia::flash('success', 'Produk berhasil diperbarui.');

        return to_route('products.index');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->productService->delete($product);

        Inertia::flash('success', 'Produk berhasil dihapus.');

        return to_route('products.index');
    }

    /**
     * Get category options for product forms.
     */
    private function categoryOptions(): Collection
    {
        return Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    /**
     * Prepare product data for Inertia responses.
     *
     * @return array<string, mixed>
     */
    private function productPayload(Product $product): array
    {
        $data = $product->toArray();

        $data['image_url'] = $product->image_path !== null
            ? Storage::disk('public')->url($product->image_path)
            : null;

        return $data;
    }
}
