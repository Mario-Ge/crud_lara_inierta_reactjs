import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

import ProductForm from "../../components/products/ProductForm";

import type { CategoryOption } from "../../types/category";
import type { ProductFormData } from "../../types/product";

interface ProductCreateProps {
    categories: CategoryOption[];
}

export default function Create({ categories }: ProductCreateProps) {
    const form = useForm<ProductFormData>({
        category_id: "",
        name: "",
        sku: "",
        description: "",
        price: "",
        stock: "0",
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

        form.post("/products", {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Tambah Produk" />

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
                            Tambah Produk
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Masukkan informasi produk yang akan ditambahkan.
                        </p>
                    </div>

                    {/* Product Form Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                        <ProductForm
                            categories={categories}
                            data={form.data}
                            errors={form.errors}
                            processing={form.processing}
                            progress={form.progress?.percentage ?? null}
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
