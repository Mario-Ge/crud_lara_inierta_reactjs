/**
 * Represents a single product inside the shopping cart.
 */
export interface CartItem {
    product_id: number;
    name: string;
    sku: string | null;
    image_url: string | null;
    unit_price: string;
    quantity: number;
    stock: number;
    stock_available: boolean;
    subtotal: string;
}

/**
 * Represents the complete shopping cart data.
 */
export interface Cart {
    items: CartItem[];
    item_count: number;
    total: string;
}
