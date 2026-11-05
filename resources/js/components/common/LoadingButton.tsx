import type { ButtonHTMLAttributes, ReactNode } from "react";

interface LoadingButtonProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
> {
    children: ReactNode;
    loading: boolean;
    loadingText?: string;
}

export default function LoadingButton({
    children,
    loading,
    loadingText = "Memproses...",
    disabled,
    type = "button",
    className,
    ...buttonProps
}: LoadingButtonProps) {
    return (
        <button
            {...buttonProps}
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={className}
        >
            <span className="inline-flex items-center justify-center gap-2">
                {/* Loading Spinner */}
                {loading && (
                    <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />

                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}

                {/* Button Text */}
                <span>{loading ? loadingText : children}</span>
            </span>
        </button>
    );
}
