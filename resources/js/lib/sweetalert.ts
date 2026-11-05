import Swal from "sweetalert2";

interface ConfirmActionOptions {
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

/**
 * Get SweetAlert2 colors based on the active application theme.
 */
function getAlertThemeColors(): {
    background: string;
    color: string;
} {
    const isDarkMode =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

    return {
        background: isDarkMode ? "#1e293b" : "#ffffff",
        color: isDarkMode ? "#f1f5f9" : "#0f172a",
    };
}

/**
 * Show a success notification.
 */
export function showSuccessNotification(message: string): void {
    void Swal.fire({
        ...getAlertThemeColors(),

        toast: true,
        position: "top-end",

        icon: "success",
        title: message,

        showConfirmButton: false,

        timer: 3500,
        timerProgressBar: true,
    });
}

/**
 * Show an error notification.
 */
export function showErrorNotification(message: string): void {
    void Swal.fire({
        ...getAlertThemeColors(),

        title: "Terjadi Kesalahan",
        text: message,
        icon: "error",

        confirmButtonText: "Mengerti",
        confirmButtonColor: "#4f46e5",
    });
}

/**
 * Display a reusable confirmation dialog.
 */
export async function confirmAction(
    options: ConfirmActionOptions,
): Promise<boolean> {
    const result = await Swal.fire({
        ...getAlertThemeColors(),

        title: options.title,
        text: options.message,
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: options.confirmButtonText ?? "Ya, Lanjutkan",

        cancelButtonText: options.cancelButtonText ?? "Batal",

        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",

        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
}

/**
 * Keep the existing product deletion confirmation helper.
 */
export async function confirmDeleteProduct(
    productName: string,
): Promise<boolean> {
    return confirmAction({
        title: "Hapus Produk?",
        message: `Produk "${productName}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
    });
}

/**
 * Show an error dialog when product deletion fails.
 */
export function showDeleteError(): void {
    void Swal.fire({
        ...getAlertThemeColors(),

        title: "Gagal Menghapus Produk",
        text: "Terjadi kesalahan saat menghapus produk. Silakan coba lagi.",
        icon: "error",

        confirmButtonText: "Mengerti",
        confirmButtonColor: "#4f46e5",
    });
}
