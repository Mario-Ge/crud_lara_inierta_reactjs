import { useState } from "react";
import type { ReactNode } from "react";

import LoadingButton from "./LoadingButton";

import { confirmAction } from "../../lib/sweetalert";

interface ConfirmDialogProps {
    title: string;
    message: string;

    confirmButtonText?: string;
    cancelButtonText?: string;

    children: ReactNode;

    onConfirm: () => void;

    loading?: boolean;
    loadingText?: string;

    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
}

export default function ConfirmDialog({
    title,
    message,
    confirmButtonText = "Ya, Lanjutkan",
    cancelButtonText = "Batal",
    children,
    onConfirm,
    loading = false,
    loadingText = "Memproses...",
    disabled = false,
    className,
    ariaLabel,
}: ConfirmDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    /**
     * Show confirmation dialog before executing the action.
     */
    async function handleClick(): Promise<void> {
        if (disabled || loading || dialogOpen) {
            return;
        }

        setDialogOpen(true);

        try {
            const confirmed = await confirmAction({
                title,
                message,
                confirmButtonText,
                cancelButtonText,
            });

            if (confirmed) {
                onConfirm();
            }
        } finally {
            setDialogOpen(false);
        }
    }

    return (
        <LoadingButton
            type="button"
            onClick={() => {
                void handleClick();
            }}
            disabled={disabled || dialogOpen}
            loading={loading}
            loadingText={loadingText}
            className={className}
            aria-label={ariaLabel}
        >
            {children}
        </LoadingButton>
    );
}
