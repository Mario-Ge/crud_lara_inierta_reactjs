import { useCallback, useEffect, useState } from "react";

// Supported application themes.
export type Theme = "light" | "dark";

// localStorage key used to persist the selected theme.
const THEME_STORAGE_KEY = "theme";

/**
 * Get the saved theme from localStorage.
 * Defaults to light mode when no valid preference exists.
 */
function getInitialTheme(): Theme {
    if (typeof window === "undefined") {
        return "light";
    }

    try {
        const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

        return savedTheme === "dark" ? "dark" : "light";
    } catch {
        return "light";
    }
}

/**
 * Apply the selected theme to the HTML root element.
 */
function applyTheme(theme: Theme): void {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    // Update native browser controls to match the selected theme.
    root.style.colorScheme = theme;
}

/**
 * Initialize the theme before the Inertia application mounts.
 * This helps reduce the appearance of an incorrect theme on page load.
 */
export function initializeTheme(): void {
    const initialTheme = getInitialTheme();

    applyTheme(initialTheme);
}

/**
 * Custom hook for managing Light Mode and Dark Mode.
 */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    // Apply and persist theme whenever it changes.
    useEffect(() => {
        applyTheme(theme);

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // The theme remains usable even if storage is unavailable.
        }
    }, [theme]);

    // Toggle between Light Mode and Dark Mode.
    const toggleTheme = useCallback((): void => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light",
        );
    }, []);

    return {
        theme,
        toggleTheme,
    };
}
