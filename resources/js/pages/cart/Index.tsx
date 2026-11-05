import { Head, Link, router } from "@inertiajs/react";

import { useRef, useState } from "react";

import CartItem from "../../components/cart/CartItem";

import { showErrorNotification } from "../../lib/sweetalert";

import type { Cart, CartItem as CartItemData } from "../../types/cart";

interface CartIndexProps {
    cart: Cart;
}

type CartAction = "update" | "remove";

interface ProcessingCartAction {
    productId: number;
    action: CartAction;
}

export default function Index({ cart }: CartIndexProps) {
    // Track the cart item and action currently being processed.
    const [processingCartAction, setProcessingCartAction] =
        useState<ProcessingCartAction | null>(null);

    // Prevent duplicate cart requests before React updates the UI.
    const cartRequestInProgress = useRef(false);

    /**
     * Format database decimal strings into Indonesian Rupiah.
     */
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 2,
    });

    /**
     * Format price for display only.
     *
     * Final price calculations remain in CartService.
     */
    function formatPrice(price: string): string {
        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice)) {
            return price;
        }

        return currencyFormatter.format(numericPrice);
    }

    /**
     * Handle the first validation error returned by Laravel.
     */
    function getFirstErrorMessage(
        errors: Record<string, string | string[]>,
    ): string | undefined {
        return Object.values(errors).find(
            (message): message is string =>
                typeof message === "string" && message.trim() !== "",
        );
    }

    /**
     * Reset the cart request state.
     */
    function finishCartRequest(): void {
        cartRequestInProgress.current = false;
        setProcessingCartAction(null);
    }

    /**
     * Update the quantity of a cart item.
     */
    function handleUpdateQuantity(productId: number, quantity: number): void {
        // Prevent duplicate or invalid requests.
        if (
            cartRequestInProgress.current ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return;
        }

        cartRequestInProgress.current = true;

        setProcessingCartAction({
            productId,
            action: "update",
        });

        router.patch(
            `/cart/${productId}`,
            {
                quantity,
            },
            {
                preserveScroll: true,

                // Handle Laravel validation errors.
                onError: (errors) => {
                    showErrorNotification(
                        getFirstErrorMessage(errors) ??
                            "Gagal memperbarui jumlah produk.",
                    );
                },

                // Handle HTTP exceptions.
                onHttpException: () => {
                    showErrorNotification(
                        "Terjadi kesalahan pada server. Silakan coba lagi.",
                    );
                },

                // Handle network errors.
                onNetworkError: () => {
                    showErrorNotification(
                        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
                    );
                },

                // Reset loading state after the request finishes.
                onFinish: finishCartRequest,
            },
        );
    }

    /**
     * Remove a product from the shopping cart.
     */
    function handleRemoveItem(item: CartItemData): void {
        // Prevent duplicate requests.
        if (cartRequestInProgress.current) {
            return;
        }

        cartRequestInProgress.current = true;

        setProcessingCartAction({
            productId: item.product_id,
            action: "remove",
        });

        router.delete(`/cart/${item.product_id}`, {
            preserveScroll: true,

            // Handle request errors.
            onError: () => {
                showErrorNotification(
                    `Gagal menghapus ${item.name} dari keranjang.`,
                );
            },

            // Handle HTTP exceptions.
            onHttpException: () => {
                showErrorNotification(
                    "Terjadi kesalahan pada server. Silakan coba lagi.",
                );
            },

            // Handle network errors.
            onNetworkError: () => {
                showErrorNotification(
                    "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
                );
            },

            // Reset loading state after the request finishes.
            onFinish: finishCartRequest,
        });
    }

    return (
        <>
            <Head title="Keranjang Belanja" />

            <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
                <div className="mx-auto max-w-7xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            SHOPPING CART
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Keranjang Belanja
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Periksa kembali produk yang ingin Anda beli.
                        </p>
                    </div>

                    {cart.items.length === 0 ? (
                        /* Empty Cart */
                        <section className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div
                                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                                aria-hidden="true"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-10 w-10"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.386c.51 0 .955.343 1.086.836l.383 1.437m0 0L7.5 15.75h9.75l2.25-9H5.105Zm2.395 9L6.375 5.273M9 19.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                    />
                                </svg>
                            </div>

                            <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                                Keranjang Anda masih kosong
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                                Anda belum menambahkan produk ke keranjang.
                                Silakan pilih produk yang ingin Anda beli.
                            </p>

                            <Link
                                href="/products"
                                className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Mulai Belanja
                            </Link>
                        </section>
                    ) : (
                        /* Cart Content */
                        <div className="grid items-start gap-6 lg:grid-cols-3">
                            {/* Product List */}
                            <section className="space-y-4 lg:col-span-2">
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                                        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                                            Produk di Keranjang
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            {cart.items.length} jenis produk
                                            {" · "}
                                            {cart.item_count.toLocaleString(
                                                "id-ID",
                                            )}{" "}
                                            total item
                                        </p>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {cart.items.map((item) => {
                                            const isCurrentItem =
                                                processingCartAction?.productId ===
                                                item.product_id;

                                            return (
                                                <CartItem
                                                    key={item.product_id}
                                                    item={item}
                                                    formatPrice={formatPrice}
                                                    onUpdateQuantity={
                                                        handleUpdateQuantity
                                                    }
                                                    onRemove={handleRemoveItem}
                                                    isProcessing={
                                                        processingCartAction !==
                                                        null
                                                    }
                                                    isUpdating={
                                                        isCurrentItem &&
                                                        processingCartAction?.action ===
                                                            "update"
                                                    }
                                                    isRemoving={
                                                        isCurrentItem &&
                                                        processingCartAction?.action ===
                                                            "remove"
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Continue Shopping */}
                                <div>
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        <span aria-hidden="true">←</span>
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </section>

                            {/* Order Summary */}
                            <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Ringkasan Belanja
                                </h2>

                                <div className="mt-6 space-y-4">
                                    {/* Product Types */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Jenis Produk
                                        </span>

                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {cart.items.length.toLocaleString(
                                                "id-ID",
                                            )}
                                        </span>
                                    </div>

                                    {/* Total Quantity */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Total Item
                                        </span>

                                        <span className="font-medium text-slate-900 dark:text-white">
                                            {cart.item_count.toLocaleString(
                                                "id-ID",
                                            )}
                                        </span>
                                    </div>

                                    {/* Grand Total */}
                                    <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                Total Belanja
                                            </span>

                                            <span className="text-right text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                                {formatPrice(cart.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Information */}
                                <div className="mt-6 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Pastikan jumlah produk dan ketersediaan
                                        stok sudah sesuai. Fitur checkout akan
                                        tersedia pada tahap berikutnya.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
