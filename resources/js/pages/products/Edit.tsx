import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

import ProductForm from "../../components/products/ProductForm";

import type { CategoryOption } from "../../types/category";
import type { Product, ProductFormData } from "../../types/product";

interface ProductEditProps {
    product: Product;
    categories: CategoryOption[];
}

export default function Edit({ product, categories }: ProductEditProps) {
    const form = useForm<ProductFormData>({
        category_id: product.category_id.toString(),
        name: product.name,
        sku: product.sku ?? "",
        description: product.description ?? "",
        price: product.price,
        stock: product.stock.toString(),
        image: null,
    });

    function handleChange<K extends keyof ProductFormData>(
        field: K,
        value: ProductFormData[K],
    ): void {
        form.setData((currentData) => ({
            ...currentData,
            [field]: value,
        }));
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            _method: "put",
        }));

        form.post(`/products/${product.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Edit Produk - ${product.name}`} />

            <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-200 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
                <div className="mx-auto max-w-4xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <Link
                            href="/products"
                            className="mb-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            ← Kembali ke Daftar Produk
                        </Link>

                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            PRODUCT MANAGEMENT
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Edit Produk
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Perbarui informasi produk yang sudah tersimpan.
                        </p>
                    </div>

                    {/* Product Form Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                        {/* Product Information */}
                        <div className="mb-6 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950">
                            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                Produk yang sedang diedit
                            </p>

                            <p className="mt-1 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                                {product.name}
                            </p>

                            <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                                ID Produk: #{product.id}
                            </p>
                        </div>

                        {/* Reusable Product Form */}
                        <ProductForm
                            categories={categories}
                            data={form.data}
                            errors={form.errors}
                            processing={form.processing}
                            progress={form.progress?.percentage ?? null}
                            currentImageUrl={product.image_url}
                            onChange={handleChange}
                            onImageChange={(file) => {
                                form.setData("image", file);
                            }}
                            onSubmit={handleSubmit}
                        />

                        {/* Cancel Button */}
                        <div className="mt-3 flex justify-end">
                            <Link
                                href="/products"
                                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
