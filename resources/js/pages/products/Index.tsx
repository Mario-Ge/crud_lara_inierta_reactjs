import { Head, Link, router } from "@inertiajs/react";

import { useState, type FormEvent } from "react";

import ProductTable from "../../components/products/ProductTable";

import { confirmDeleteProduct, showDeleteError } from "../../lib/sweetalert";

import type { CategoryOption } from "../../types/category";
import type { PaginatedData } from "../../types/pagination";
import type { Product } from "../../types/product";

interface ProductIndexProps {
    products: PaginatedData<Product>;

    categories: CategoryOption[];

    filters: {
        search: string;
        category_id: number | null;
    };
}

export default function Index({
    products,
    categories,
    filters,
}: ProductIndexProps) {
    const [search, setSearch] = useState(filters.search);

    const [categoryId, setCategoryId] = useState(
        filters.category_id?.toString() ?? "",
    );

    const [deletingProductId, setDeletingProductId] = useState<number | null>(
        null,
    );

    /**
     * Handle product search and category filter.
     */
    function handleFilterSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const query: {
            search?: string;
            category_id?: string;
        } = {};

        const normalizedSearch = search.trim();

        if (normalizedSearch !== "") {
            query.search = normalizedSearch;
        }

        if (categoryId !== "") {
            query.category_id = categoryId;
        }

        router.get("/products", query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    /**
     * Reset search and category filters.
     */
    function handleResetFilters(): void {
        setSearch("");
        setCategoryId("");

        router.get(
            "/products",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    /**
     * Confirm and delete a product.
     */
    async function handleDeleteProduct(product: Product): Promise<void> {
        if (deletingProductId !== null) {
            return;
        }

        const confirmed = await confirmDeleteProduct(product.name);

        if (!confirmed) {
            return;
        }

        setDeletingProductId(product.id);

        router.delete(`/products/${product.id}`, {
            preserveScroll: true,

            onError: showDeleteError,

            onHttpException: showDeleteError,

            onNetworkError: showDeleteError,

            onFinish: () => {
                setDeletingProductId(null);
            },
        });
    }

    return (
        <>
            <Head title="Daftar Produk" />

            <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                PRODUCT MANAGEMENT
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Daftar Produk
                            </h1>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Kelola produk, kategori, harga, dan stok.
                            </p>
                        </div>

                        <Link
                            href="/products/create"
                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            + Tambah Produk
                        </Link>
                    </div>

                    {/* Product Summary */}
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Total Produk
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                            {products.total.toLocaleString("id-ID")}
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
                        <form onSubmit={handleFilterSubmit}>
                            <div className="grid gap-4 md:grid-cols-3">
                                {/* Search */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="search"
                                        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Cari Produk
                                    </label>

                                    <input
                                        id="search"
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Cari nama produk atau SKU..."
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <label
                                        htmlFor="category_id"
                                        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Filter Kategori
                                    </label>

                                    <select
                                        id="category_id"
                                        value={categoryId}
                                        onChange={(event) =>
                                            setCategoryId(event.target.value)
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                                    >
                                        <option value="">Semua Kategori</option>

                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Terapkan Filter
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Product Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
                        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                            <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                                Data Produk
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Berikut daftar produk yang tersimpan.
                            </p>
                        </div>

                        <ProductTable
                            products={products.data}
                            onDelete={handleDeleteProduct}
                            deletingProductId={deletingProductId}
                        />

                        {/* Pagination Information */}
                        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Menampilkan {products.from ?? 0}
                                {" - "}
                                {products.to ?? 0}
                                {" dari "}
                                {products.total.toLocaleString("id-ID")}
                                {" produk"}
                            </p>

                            {/* Pagination Links */}
                            <nav
                                aria-label="Navigasi halaman produk"
                                className="flex flex-wrap items-center gap-1"
                            >
                                {products.links.map((link, index) => {
                                    const label = link.label
                                        .replace(/&laquo;/g, "«")
                                        .replace(/&raquo;/g, "»");

                                    const linkClassName = [
                                        "rounded-lg px-3 py-2 text-sm font-medium transition",

                                        link.active
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",

                                        !link.url
                                            ? "pointer-events-none opacity-40"
                                            : "",
                                    ].join(" ");

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={index}
                                                className={linkClassName}
                                            >
                                                {label}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            aria-current={
                                                link.active ? "page" : undefined
                                            }
                                            className={linkClassName}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
