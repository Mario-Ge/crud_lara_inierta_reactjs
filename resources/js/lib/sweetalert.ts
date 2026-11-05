import Swal from "sweetalert2";

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
 *
 * @param message - Success message received from Laravel.
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
 *
 * @param message - Safe error message to display.
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
 * Show a confirmation dialog before deleting a product.
 *
 * @param productName - Name of the product to delete.
 * @returns True when the user confirms, otherwise false.
 */
export async function confirmDeleteProduct(
    productName: string,
): Promise<boolean> {
    const result = await Swal.fire({
        ...getAlertThemeColors(),

        title: "Hapus Produk?",
        text: `Produk "${productName}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`,
        icon: "warning",

        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",

        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",

        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
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
