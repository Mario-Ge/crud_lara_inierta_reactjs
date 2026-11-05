import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";

import FlashMessage from "../components/common/FlashMessage";
import { useTheme } from "../hooks/useTheme";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
            {/* Global Flash Message Listener */}
            <FlashMessage />

            {/* Application Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
                        {/* Application Brand */}
                        <Link
                            href="/products"
                            aria-label="Product Manager - Beranda"
                            className="inline-flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                                PM
                            </div>

                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                    Product Manager
                                </h1>

                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Simple CRUD Application
                                </p>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav
                            aria-label="Navigasi utama"
                            className="flex flex-wrap items-center gap-2"
                        >
                            <Link
                                href="/products"
                                className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                            >
                                Daftar Produk
                            </Link>

                            <Link
                                href="/products/create"
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                + Tambah Produk
                            </Link>

                            {/* Theme Toggle */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label={
                                    theme === "dark"
                                        ? "Aktifkan Light Mode"
                                        : "Aktifkan Dark Mode"
                                }
                                aria-pressed={theme === "dark"}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                <span aria-hidden="true">
                                    {theme === "dark" ? "☀" : "☾"}
                                </span>

                                <span>
                                    {theme === "dark"
                                        ? "Mode Terang"
                                        : "Mode Gelap"}
                                </span>
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Page Content */}
            <div className="flex-1">{children}</div>

            {/* Application Footer */}
            <footer className="border-t border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Product Manager
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Aplikasi latihan Full-Stack Development
                        {" · "}
                        Laravel 13 + React + TypeScript
                    </p>
                </div>
            </footer>
        </div>
    );
}
