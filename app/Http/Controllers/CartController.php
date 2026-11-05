<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Inject CartService into the controller.
     */
    public function __construct(
        private readonly CartService $cartService
    ) {
    }

    /**
     * Display the shopping cart.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('cart/Index', [
            'cart' => $this->cartService->getCart($request),
        ]);
    }

    /**
     * Add a product to the shopping cart.
     */
    public function store(
        AddCartItemRequest $request
    ): RedirectResponse {
        $validated = $request->validated();

        $this->cartService->addItem(
            $request,
            (int) $validated['product_id'],
            (int) $validated['quantity']
        );

        Inertia::flash(
            'success',
            'Produk berhasil ditambahkan ke keranjang.'
        );

        return back();
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(
        UpdateCartItemRequest $request,
        Product $product
    ): RedirectResponse {
        $validated = $request->validated();

        $this->cartService->updateQuantity(
            $request,
            $product,
            (int) $validated['quantity']
        );

        Inertia::flash(
            'success',
            'Jumlah produk berhasil diperbarui.'
        );

        return to_route('cart.index');
    }

    /**
     * Remove a product from the shopping cart.
     */
    public function destroy(
        Request $request,
        Product $product
    ): RedirectResponse {
        $this->cartService->removeItem(
            $request,
            $product->id
        );

        Inertia::flash(
            'success',
            'Produk berhasil dihapus dari keranjang.'
        );

        return to_route('cart.index');
    }
}
