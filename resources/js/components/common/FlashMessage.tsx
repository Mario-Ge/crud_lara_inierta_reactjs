import { useEffect } from "react";
import { router } from "@inertiajs/react";

import {
    showErrorNotification,
    showSuccessNotification,
} from "../../lib/sweetalert";

export default function FlashMessage() {
    /**
     * Listen for flash data received from Laravel through Inertia.
     */
    useEffect(() => {
        const removeFlashListener = router.on("flash", (event) => {
            const { success, error } = event.detail.flash;

            // Handle error notification first.
            if (typeof error === "string" && error.trim() !== "") {
                showErrorNotification(error);

                return;
            }

            // Handle success notification.
            if (typeof success === "string" && success.trim() !== "") {
                showSuccessNotification(success);
            }
        });

        // Remove the listener when the component unmounts.
        return () => {
            removeFlashListener();
        };
    }, []);

    // This component does not render any visible HTML element.
    return null;
}
