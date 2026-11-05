import { useEffect, useState } from "react";
import type { FormEventHandler } from "react";

import type { CategoryOption } from "../../types/category";
import type { ProductFormData } from "../../types/product";

interface ProductFormProps {
    categories: CategoryOption[];
    data: ProductFormData;
    errors: Partial<Record<keyof ProductFormData, string>>;
    processing: boolean;
    progress: number | null;
    currentImageUrl?: string | null;

    onChange: <K extends keyof ProductFormData>(
        field: K,
        value: ProductFormData[K],
    ) => void;

    onImageChange: (file: File | null) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function ProductForm({
    categories,
    data,
    errors,
    processing,
    progress,
    currentImageUrl = null,
    onChange,
    onImageChange,
    onSubmit,
}: ProductFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Create temporary image preview URL.
    useEffect(() => {
        if (!data.image) {
            setImagePreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);

        setImagePreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [data.image]);

    const displayedImage = imagePreview ?? currentImageUrl;

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Nama Produk */}
            <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Nama Produk <span className="text-red-500">*</span>
                </label>

                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(event) => onChange("name", event.target.value)}
                    placeholder="Masukkan nama produk"
                    maxLength={150}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                />

                {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Kategori */}
            <div>
                <label
                    htmlFor="category_id"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Kategori <span className="text-red-500">*</span>
                </label>

                <select
                    id="category_id"
                    value={data.category_id}
                    onChange={(event) =>
                        onChange("category_id", event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                >
                    <option value="">Pilih Kategori</option>

                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {errors.category_id && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.category_id}
                    </p>
                )}
            </div>

            {/* SKU */}
            <div>
                <label
                    htmlFor="sku"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    SKU
                </label>

                <input
                    id="sku"
                    type="text"
                    value={data.sku}
                    onChange={(event) => onChange("sku", event.target.value)}
                    placeholder="Contoh: ELK-001"
                    maxLength={100}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                />

                {errors.sku && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.sku}
                    </p>
                )}
            </div>

            {/* Deskripsi */}
            <div>
                <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Deskripsi
                </label>

                <textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(event) =>
                        onChange("description", event.target.value)
                    }
                    placeholder="Masukkan deskripsi produk"
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                />

                {errors.description && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.description}
                    </p>
                )}
            </div>

            {/* Harga dan Stok */}
            <div className="grid gap-6 sm:grid-cols-2">
                {/* Harga */}
                <div>
                    <label
                        htmlFor="price"
                        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Harga (Rp) <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="price"
                        type="number"
                        min="0"
                        max="9999999999.99"
                        step="0.01"
                        value={data.price}
                        onChange={(event) =>
                            onChange("price", event.target.value)
                        }
                        placeholder="Contoh: 150000"
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                    />

                    {errors.price && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.price}
                        </p>
                    )}
                </div>

                {/* Stok */}
                <div>
                    <label
                        htmlFor="stock"
                        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Stok <span className="text-red-500">*</span>
                    </label>

                    <input
                        id="stock"
                        type="number"
                        min="0"
                        max="4294967295"
                        step="1"
                        value={data.stock}
                        onChange={(event) =>
                            onChange("stock", event.target.value)
                        }
                        placeholder="Masukkan stok"
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
                    />

                    {errors.stock && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.stock}
                        </p>
                    )}
                </div>
            </div>

            {/* Upload Gambar */}
            <div>
                <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    Gambar Produk
                </label>

                <input
                    id="image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                        onImageChange(event.target.files?.[0] ?? null)
                    }
                    className="block w-full cursor-pointer rounded-lg border border-slate-300 text-sm text-slate-700 file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-3 file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 dark:border-slate-700 dark:text-slate-300 dark:file:bg-indigo-950 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900"
                />

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Format JPG, JPEG, PNG, atau WebP. Maksimal 2 MB.
                </p>

                {errors.image && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.image}
                    </p>
                )}

                {/* Image Preview */}
                {displayedImage && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Preview Gambar
                        </p>

                        <img
                            src={displayedImage}
                            alt="Preview gambar produk"
                            className="h-40 w-40 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                        />
                    </div>
                )}
            </div>

            {/* Upload Progress */}
            {progress !== null && (
                <div>
                    <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                            Mengunggah gambar
                        </span>

                        <span className="text-slate-500 dark:text-slate-400">
                            {progress}%
                        </span>
                    </div>

                    <progress
                        value={progress}
                        max={100}
                        aria-label="Progress upload gambar"
                        className="h-2 w-full"
                    />
                </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? "Menyimpan..." : "Simpan Produk"}
                </button>
            </div>
        </form>
    );
}
