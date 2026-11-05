import { Link } from "@inertiajs/react";

import ConfirmDialog from "../common/ConfirmDialog";

import type { Product } from "../../types/product";

interface ProductTableProps {
    products: Product[];

    onDelete: (product: Product) => void;

    deletingProductId: number | null;

    onAddToCart: (product: Product) => void;

    addingProductId: number | null;
}

export default function ProductTable({
    products,
    onDelete,
    deletingProductId,
    onAddToCart,
    addingProductId,
}: ProductTableProps) {
    const currencyFormatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 2,
    });

    function formatPrice(price: string): string {
        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice)) {
            return price;
        }

        return currencyFormatter.format(numericPrice);
    }

    if (products.length === 0) {
        return (
            <div className="px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Produk belum tersedia
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Belum ada produk yang dapat ditampilkan.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                {/* Table Header */}
                <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Gambar</th>

                        <th className="px-6 py-4 font-semibold">Produk</th>

                        <th className="px-6 py-4 font-semibold">Kategori</th>

                        <th className="px-6 py-4 font-semibold">Harga</th>

                        <th className="px-6 py-4 font-semibold">Stok</th>

                        <th className="px-6 py-4 text-center font-semibold">
                            Aksi
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {products.map((product) => {
                        const isAdding = addingProductId === product.id;

                        const isOutOfStock = product.stock < 1;

                        return (
                            <tr
                                key={product.id}
                                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            >
                                {/* Product Image */}
                                <td className="px-6 py-4">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={`Gambar ${product.name}`}
                                            className="h-14 w-14 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-slate-700 dark:text-slate-300">
                                            No Image
                                        </div>
                                    )}
                                </td>

                                {/* Product Information */}
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                                        {product.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        SKU: {product.sku ?? "-"}
                                    </p>
                                </td>

                                {/* Category */}
                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                        {product.category.name}
                                    </span>
                                </td>

                                {/* Price */}
                                <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-200">
                                    {formatPrice(product.price)}
                                </td>

                                {/* Stock */}
                                <td className="px-6 py-4 text-slate-700 dark:text-slate-200">
                                    {product.stock.toLocaleString("id-ID")}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        {/* Add to Cart Button */}
                                        <button
                                            type="button"
                                            onClick={() => onAddToCart(product)}
                                            disabled={
                                                addingProductId !== null ||
                                                isOutOfStock
                                            }
                                            aria-label={`Tambah ${product.name} ke keranjang`}
                                            aria-busy={isAdding}
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isAdding
                                                ? "Menambahkan..."
                                                : isOutOfStock
                                                  ? "Stok Habis"
                                                  : "Add to Cart"}
                                        </button>

                                        {/* Edit Button */}
                                        <Link
                                            href={`/products/${product.id}/edit`}
                                            className="inline-flex rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
                                        >
                                            Edit
                                        </Link>

                                        {/* Delete Confirmation */}
                                        <ConfirmDialog
                                            title="Hapus Produk?"
                                            message={`Produk "${product.name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
                                            confirmButtonText="Ya, Hapus"
                                            cancelButtonText="Batal"
                                            onConfirm={() => onDelete(product)}
                                            loading={
                                                deletingProductId === product.id
                                            }
                                            loadingText="Menghapus..."
                                            disabled={
                                                deletingProductId !== null
                                            }
                                            ariaLabel={`Hapus ${product.name}`}
                                            className="inline-flex rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                                        >
                                            Hapus
                                        </ConfirmDialog>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
