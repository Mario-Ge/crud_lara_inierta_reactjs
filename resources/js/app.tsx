import { createInertiaApp } from "@inertiajs/react";

import AppLayout from "./layouts/AppLayout";
import { initializeTheme } from "./hooks/useTheme";

// Apply saved theme before mounting the Inertia application.
initializeTheme();

createInertiaApp({
    pages: {
        path: "./pages",
        extension: ".tsx",
    },

    // Use AppLayout as the default layout.
    layout: () => AppLayout,
});
