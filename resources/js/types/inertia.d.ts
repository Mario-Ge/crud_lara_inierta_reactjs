import "@inertiajs/core";

declare module "@inertiajs/core" {
    export interface InertiaConfig {
        flashDataType: {
            success?: string;
            error?: string;
        };
    }
}
