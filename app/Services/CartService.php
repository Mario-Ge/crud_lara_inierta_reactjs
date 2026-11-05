<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class CartService
{
    /**
     * Session key used to store cart items.
     */
    private const SESSION_KEY = 'cart';

    /**
     * Add a product to the shopping cart.
     *
     * Session stores product ID and quantity only.
     */
    public function addItem(
        Request $request,
        int $productId,
        int $quantity
    ): void {
        // Find the latest product data from the database.
        $product = Product::query()->findOrFail($productId);

        $this->validateQuantity($quantity);

        // Retrieve current cart items from the session.
        $cart = $this->getSessionItems($request);

        // Add the new quantity to the existing quantity.
        $newQuantity = ($cart[$product->id] ?? 0) + $quantity;

        // Check current stock before updating the session.
        $this->ensureAvailableStock($product, $newQuantity);

        $cart[$product->id] = $newQuantity;

        // Save updated cart items to the session.
        $request->session()->put(self::SESSION_KEY, $cart);
    }

    /**
     * Get complete cart details using session and database data.
     *
     * Prices and product information are always retrieved
     * from the database, never trusted from the session.
     *
     * @return array{
     *     items: list<array{
     *         product_id: int,
     *         name: string,
     *         sku: string|null,
     *         image_url: string|null,
     *         unit_price: string,
     *         quantity: int,
     *         stock: int,
     *         stock_available: bool,
     *         subtotal: string
     *     }>,
     *     item_count: int,
     *     total: string
     * }
     */
    public function getCart(Request $request): array
    {
        $cart = $this->getSessionItems($request);

        // Return an empty cart when there are no items.
        if ($cart === []) {
            return [
                'items' => [],
                'item_count' => 0,
                'total' => '0.00',
            ];
        }

        // Retrieve all existing products in one database query.
        $products = Product::query()
            ->whereIn('id', array_keys($cart))
            ->get()
            ->keyBy('id');

        $items = [];
        $cleanCart = [];

        $totalMinorUnits = 0;
        $itemCount = 0;

        foreach ($cart as $productId => $quantity) {
            $product = $products->get($productId);

            // Skip products that no longer exist in the database.
            if (!$product instanceof Product) {
                continue;
            }

            // Convert database decimal price to integer minor units.
            $unitPriceMinorUnits = $this->toMinorUnits(
                (string) $product->price
            );

            // Calculate subtotal without floating-point arithmetic.
            $subtotalMinorUnits = $this->safeMultiply(
                $unitPriceMinorUnits,
                $quantity
            );

            // Add subtotal to the cart total.
            $totalMinorUnits = $this->safeAdd(
                $totalMinorUnits,
                $subtotalMinorUnits
            );

            $itemCount = $this->safeAdd(
                $itemCount,
                $quantity
            );

            // Preserve only valid product ID and quantity pairs.
            $cleanCart[$product->id] = $quantity;

            $items[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,

                'image_url' => $product->image_path !== null
                    ? Storage::disk('public')->url($product->image_path)
                    : null,

                'unit_price' => (string) $product->price,
                'quantity' => $quantity,
                'stock' => $product->stock,

                // Indicate whether current quantity is still available.
                'stock_available' => $quantity <= $product->stock,

                'subtotal' => $this->formatMinorUnits(
                    $subtotalMinorUnits
                ),
            ];
        }

        // Remove products that were deleted from the database.
        if ($cleanCart !== $cart) {
            $this->saveSessionItems($request, $cleanCart);
        }

        return [
            'items' => $items,
            'item_count' => $itemCount,
            'total' => $this->formatMinorUnits($totalMinorUnits),
        ];
    }

    /**
     * Update the quantity of an existing cart item.
     */
    public function updateQuantity(
        Request $request,
        Product $product,
        int $quantity
    ): void {
        $this->validateQuantity($quantity);

        $cart = $this->getSessionItems($request);

        // Ensure the product is already in the cart.
        if (!array_key_exists($product->id, $cart)) {
            throw ValidationException::withMessages(['quantity' => 'Produk tidak ditemukan di dalam keranjang.']);
        }

        // Check stock using the latest product data.
        $this->ensureAvailableStock($product, $quantity);

        $cart[$product->id] = $quantity;

        $request->session()->put(self::SESSION_KEY, $cart);
    }

    /**
     * Remove a product from the shopping cart.
     */
    public function removeItem(
        Request $request,
        int $productId
    ): void {
        $cart = $this->getSessionItems($request);

        // Remove the selected product ID.
        unset($cart[$productId]);

        $this->saveSessionItems($request, $cart);
    }

    /**
     * Retrieve and normalize cart data from Laravel Session.
     *
     * Invalid session values are discarded.
     *
     * @return array<int, int>
     */
    private function getSessionItems(Request $request): array
    {
        $sessionCart = $request->session()->get(
            self::SESSION_KEY,
            []
        );

        // Handle invalid cart session structure.
        if (!is_array($sessionCart)) {
            $request->session()->forget(self::SESSION_KEY);

            return [];
        }

        $cart = [];

        foreach ($sessionCart as $productId => $quantity) {
            // Accept only integer or string values.
            if (
                (!is_int($productId) && !is_string($productId))
                || (!is_int($quantity) && !is_string($quantity))
            ) {
                continue;
            }

            $validProductId = filter_var(
                $productId,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]]
            );

            $validQuantity = filter_var(
                $quantity,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1]]
            );

            // Ignore invalid product IDs and quantities.
            if (
                $validProductId === false
                || $validQuantity === false
            ) {
                continue;
            }

            $cart[$validProductId] = $validQuantity;
        }

        // Persist normalized session data when necessary.
        if ($cart !== $sessionCart) {
            $this->saveSessionItems($request, $cart);
        }

        return $cart;
    }

    /**
     * Save cart items or remove the session key when empty.
     *
     * @param array<int, int> $cart
     */
    private function saveSessionItems(
        Request $request,
        array $cart
    ): void {
        if ($cart === []) {
            $request->session()->forget(self::SESSION_KEY);

            return;
        }

        $request->session()->put(self::SESSION_KEY, $cart);
    }

    /**
     * Validate that the requested quantity is at least one.
     */
    private function validateQuantity(int $quantity): void
    {
        if ($quantity < 1) {
            throw ValidationException::withMessages(['quantity' => 'Jumlah produk minimal 1.']);
        }
    }

    /**
     * Check whether enough stock is available.
     */
    private function ensureAvailableStock(
        Product $product,
        int $quantity
    ): void {
        if ($product->stock < $quantity) {
            throw ValidationException::withMessages(['quantity' => "Stok produk {$product->name} tidak mencukupi. Stok tersedia: {$product->stock}."]);
        }
    }

    /**
     * Convert a decimal price string to integer minor units (cents).
     *
     * Example:
     * "15000.50" becomes 1500050.
     */
    private function toMinorUnits(string $price): int
    {
        if (!preg_match('/^\d+(?:\.\d{1,2})?$/', $price)) {
            throw new \UnexpectedValueException('Invalid decimal product price.');
        }

        [$whole, $fraction] = array_pad(
            explode('.', $price, 2),
            2,
            '00'
        );

        $fraction = str_pad($fraction, 2, '0');

        $wholeUnits = (int) $whole;
        $fractionUnits = (int) $fraction;

        if ($wholeUnits > intdiv(
            PHP_INT_MAX - $fractionUnits,
            100
        )) {
            $this->throwCartOverflow();
        }

        return ($wholeUnits * 100) + $fractionUnits;
    }

    /**
     * Multiply integer minor units without floating-point arithmetic.
     */
    private function safeMultiply(
        int $amount,
        int $quantity
    ): int {
        if (
            $amount > 0
            && $quantity > intdiv(PHP_INT_MAX, $amount)
        ) {
            $this->throwCartOverflow();
        }

        return $amount * $quantity;
    }

    /**
     * Add integer values while checking for integer overflow.
     */
    private function safeAdd(
        int $left,
        int $right
    ): int {
        if ($right > PHP_INT_MAX - $left) {
            $this->throwCartOverflow();
        }

        return $left + $right;
    }

    /**
     * Format integer minor units into a decimal string.
     *
     * Example:
     * 1500050 becomes "15000.50".
     */
    private function formatMinorUnits(int $minorUnits): string
    {
        $wholeUnits = intdiv($minorUnits, 100);

        $fractionUnits = $minorUnits % 100;

        return $wholeUnits.'.'
            .str_pad(
                (string) $fractionUnits,
                2,
                '0',
                STR_PAD_LEFT
            );
    }

    /**
     * Stop calculations that exceed PHP integer capacity.
     */
    private function throwCartOverflow(): never
    {
        throw ValidationException::withMessages(['cart' => 'Nilai total keranjang melebihi batas perhitungan yang aman.']);
    }
}
