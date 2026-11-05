import type { CategoryOption } from "./category";

export interface Product {
    id: number;
    category_id: number;

    name: string;
    sku: string | null;
    description: string | null;

    price: string;
    stock: number;

    image_path: string | null;
    image_url: string | null;

    category: CategoryOption;

    created_at: string;
    updated_at: string;
}

export interface ProductFormData {
    category_id: string;
    name: string;
    sku: string;
    description: string;
    price: string;
    stock: string;
    image: File | null;
}
