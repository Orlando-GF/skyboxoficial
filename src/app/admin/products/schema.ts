import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    price: z.coerce.number().min(0.01, "Preço inválido"),
    original_price: z.coerce.number().optional(), // Preço "De"
    category: z.string().min(1, "Selecione uma categoria"),
    image: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
    stock: z.boolean().default(true),
    flavor_tags: z.array(z.string()).default([]),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    description: z.string().optional(),
    is_kit: z.boolean().default(false),
    kit_items: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;
