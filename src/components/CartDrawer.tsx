"use client";

import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/types";
import { formatBRL } from "@/utils/format";
import Image from "next/image";

export default function CartDrawer() {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore();

    const handleCheckout = async () => {
        const supabase = createClient();
        const { data: config } = await supabase.from("store_settings").select("whatsapp_number").single();
        const phoneNumber = config?.whatsapp_number || "5511999999999";

        const itemsList = items
            .map((item) => `${item.quantity}x ${item.name} - ${formatBRL(item.price * item.quantity)}`)
            .join("\n");

        const totalValue = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const isSingleItem = items.length === 1 && items[0].quantity === 1;
        const introText = isSingleItem ? "Escolhi este item no site:" : "Montei meu kit no site:";

        const message = `Salve Skybox! ✨ ${introText}\n\n${itemsList}\n\nTotal: ${formatBRL(totalValue)}\n\nAguardo a confirmação.`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 z-40 bg-black/80"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-black border-l-2 border-primary shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b-2 border-white/5 flex items-center justify-between">
                            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">PROTOCOL_CART</h2>
                            <button onClick={toggleCart} className="text-primary/60 hover:text-primary transition-colors border border-white/10 p-2 hover:bg-primary/5">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="text-center text-muted py-10">
                                    <p>Seu carrinho está vazio.</p>
                                    <p className="text-sm">Adicione alguns itens para começar.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 p-4 bg-white/5 border-2 border-white/5"
                                    >
                                        <div className="relative w-20 h-20 rounded-none overflow-hidden bg-black/20 shrink-0 border border-white/10">
                                            {/* Placeholder image */}
                                            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-white">{item.name}</h3>
                                                <p className="text-secondary font-mono">{formatBRL(item.price)}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 bg-white/10 p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-primary transition-colors disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-primary transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-primary/40 hover:text-red-500 transition-colors ml-auto p-1 border border-white/5 hover:border-red-500/20"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="p-8 border-t-2 border-white/5 bg-black">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-primary/60 font-bold uppercase tracking-widest text-xs">Total Order</span>
                                <span className="text-3xl font-bold text-primary font-mono">
                                    {formatBRL(total())}
                                </span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={items.length === 0}
                                className="w-full bg-primary hover:bg-white text-black font-black py-5 border-2 border-primary hover:border-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                            >
                                <MessageCircle className="w-5 h-5" />
                                TRANSMITIR PEDIDO
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
