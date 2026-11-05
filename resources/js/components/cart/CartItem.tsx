import ConfirmDialog from "../common/ConfirmDialog";

import type { CartItem as CartItemData } from "../../types/cart";

interface CartItemProps {
    item: CartItemData;

    formatPrice: (price: string) => string;

    onUpdateQuantity: (productId: number, quantity: number) => void;

    onRemove: (item: CartItemData) => void;

    isProcessing: boolean;

    isUpdating: boolean;

    isRemoving: boolean;
}

export default function CartItem({
    item,
    formatPrice,
    onUpdateQuantity,
    onRemove,
    isProcessing,
    isUpdating,
    isRemoving,
}: CartItemProps) {
    return (
        <article className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* Product Image */}
                <div className="shrink-0">
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={`Gambar ${item.name}`}
                            className="h-24 w-24 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                        />
                    ) : (
                        <div
                            className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                            aria-label="Gambar produk tidak tersedia"
                        >
                            No Image
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                SKU: {item.sku ?? "-"}
                            </p>
                        </div>

                        <p className="font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-400">
                            {formatPrice(item.subtotal)}
                        </p>
                    </div>

                    {/* Product Details */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <p>
                            Harga satuan:{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                {formatPrice(item.unit_price)}
                            </span>
                        </p>

                        <p>
                            Stok saat ini:{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                {item.stock.toLocaleString("id-ID")}
                            </span>
                        </p>
                    </div>

                    {/* Stock Warning */}
                    {!item.stock_available && (
                        <div
                            role="alert"
                            className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                        >
                            Jumlah produk dalam keranjang melebihi stok yang
                            tersedia. Silakan kurangi quantity sebelum checkout.
                        </div>
                    )}

                    {/* Quantity Controls */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Quantity:
                        </span>

                        <div
                            className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-700"
                            aria-label={`Quantity ${item.name}`}
                        >
                            {/* Decrease Quantity */}
                            <button
                                type="button"
                                onClick={() =>
                                    onUpdateQuantity(
                                        item.product_id,
                                        item.quantity - 1,
                                    )
                                }
                                disabled={isProcessing || item.quantity <= 1}
                                aria-label={`Kurangi quantity ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center rounded-l-lg text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                −
                            </button>

                            {/* Current Quantity */}
                            <span
                                className="flex h-9 min-w-12 items-center justify-center border-x border-slate-300 px-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-white"
                                aria-live="polite"
                            >
                                {item.quantity.toLocaleString("id-ID")}
                            </span>

                            {/* Increase Quantity */}
                            <button
                                type="button"
                                onClick={() =>
                                    onUpdateQuantity(
                                        item.product_id,
                                        item.quantity + 1,
                                    )
                                }
                                disabled={
                                    isProcessing || item.quantity >= item.stock
                                }
                                aria-label={`Tambah quantity ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center rounded-r-lg text-lg font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                +
                            </button>
                        </div>

                        {/* Update Loading Indicator */}
                        {isUpdating && (
                            <span
                                className="text-xs text-indigo-600 dark:text-indigo-400"
                                role="status"
                            >
                                Memperbarui...
                            </span>
                        )}
                    </div>

                    {/* Subtotal */}
                    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Subtotal:{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {formatPrice(item.subtotal)}
                            </span>
                        </p>
                    </div>

                    {/* Remove Item */}
                    <div className="mt-4">
                        <ConfirmDialog
                            title="Hapus dari Keranjang?"
                            message={`Produk "${item.name}" akan dihapus dari keranjang belanja Anda.`}
                            confirmButtonText="Ya, Hapus"
                            cancelButtonText="Batal"
                            onConfirm={() => onRemove(item)}
                            loading={isRemoving}
                            loadingText="Menghapus..."
                            disabled={isProcessing}
                            ariaLabel={`Hapus ${item.name} dari keranjang`}
                            className="inline-flex rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                        >
                            Hapus
                        </ConfirmDialog>
                    </div>
                </div>
            </div>
        </article>
    );
}
