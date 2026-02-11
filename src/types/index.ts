export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    image: string;
    stock: boolean;
    featured?: boolean;
    flavor_tags?: string[];
    seo_title?: string;
    seo_description?: string;
    created_at?: string;
}

export interface CartItem extends Product {
    quantity: number;
}
