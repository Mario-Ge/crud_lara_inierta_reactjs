import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <>
            <Head title="Selamat Datang" />

            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
                <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                        Laravel 13 · Inertia v3 · React · TypeScript
                    </p>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Aplikasi CRUD Produk
                    </h1>

                    <p className="mt-4 leading-relaxed text-slate-600">
                        Selamat datang! Halaman ini berhasil ditampilkan
                        menggunakan Laravel, Inertia.js, React, dan TypeScript.
                    </p>

                    <div className="mt-8 rounded-xl bg-indigo-50 p-4">
                        <p className="font-medium text-indigo-900">
                            Tahap integrasi frontend
                        </p>

                        <p className="mt-1 text-sm text-indigo-700">
                            Fondasi aplikasi berhasil disiapkan. Selanjutnya
                            kita akan mulai membangun fitur manajemen produk.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
