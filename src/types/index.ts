export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    original_price?: number;
    category: string;
    image: string;
    stock: boolean;
    featured?: boolean;
    flavor_tags?: string[];
    seo_title?: string;
    seo_description?: string;
    created_at?: string;
    is_kit?: boolean;
    kit_items?: string[];
}

export interface CartItem extends Product {
    quantity: number;
}

export interface StoreSettings {
    id: string;
    store_name: string;
    whatsapp_number: string;
    instagram_url: string;
    facebook_url: string;
    address: string;
    google_maps_url: string;
    hours_weekdays: string;
    hours_saturday: string;
    hours_sunday: string;
    label_weekdays: string;
    label_saturday: string;
    label_sunday: string;
    cnpj: string;
    terms_content: string;
    payment_discount_percentage: number;
    cash_discount_percentage: number;
}
