"use client";

import { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2, MessageCircle, Truck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/types";
import { formatBRL } from "@/utils/format";
import Image from "next/image";
import { toast } from "sonner";

export default function CartDrawer() {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore();

    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [discountPercentage, setDiscountPercentage] = useState(5.0);
    const [cashDiscountPercentage, setCashDiscountPercentage] = useState(5.0);

    useEffect(() => {
        const fetchSettings = async () => {
            const supabase = createClient();
            const { data } = await supabase.from("store_settings").select("payment_discount_percentage, cash_discount_percentage").single();
            if (data) {
                setDiscountPercentage(data.payment_discount_percentage ?? 5.0);
                setCashDiscountPercentage(data.cash_discount_percentage ?? 5.0);
            }
        };
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);

    const handleCheckout = async () => {
        const supabase = createClient();
        const { data: config } = await supabase.from("store_settings").select("whatsapp_number").single();
        const phoneNumber = config?.whatsapp_number || "5511999999999";

        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const activeDiscountPercentage = paymentMethod === 'pix'
            ? discountPercentage
            : (paymentMethod === 'cash' ? cashDiscountPercentage : 0);

        const discount = subtotal * (activeDiscountPercentage / 100);
        const totalValue = subtotal - discount;

        const itemsList = items
            .map((item) => `• ${item.quantity}x ${item.name} | ${formatBRL(item.price * item.quantity)}`)
            .join("\n");

        const message = `🚀 *PEDIDO SKYBOX* 🚀
-------------------------
${itemsList}
-------------------------
💰 *Subtotal:* ${formatBRL(subtotal)}
${discount > 0 ? `🏷️ *Desconto (${activeDiscountPercentage}%):* -${formatBRL(discount)}\n` : ''}
🔥 *TOTAL FINAL:* ${formatBRL(totalValue)}

💳 *Forma de Pagamento:*
${paymentMethod === 'pix' ? '(X) PIX' : '( ) PIX'}
${paymentMethod === 'credit' ? '(X) Cartão de Crédito' : '( ) Cartão de Crédito'}
${paymentMethod === 'cash' ? '(X) Dinheiro/Entrega' : '( ) Dinheiro/Entrega'}

🚚 *Entrega:* A combinar via WhatsApp`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Determine active discount based on method
    const activeDiscountPercentage = paymentMethod === 'pix'
        ? discountPercentage
        : (paymentMethod === 'cash' ? cashDiscountPercentage : 0);

    const discount = subtotal * (activeDiscountPercentage / 100);
    const finalTotal = subtotal - discount;

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
                        className="fixed inset-0 z-[65] bg-black/80"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-black border-l-2 border-primary shadow-2xl flex flex-col"
                    >
                        <div className="p-5 border-b-2 border-white/5 flex items-center justify-between shrink-0">
                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tighter">SEU CARRINHO</h2>
                            <button onClick={toggleCart} className="text-primary/60 hover:text-primary transition-colors border border-white/10 p-2 hover:bg-primary/5">
                                <X className="w-5 h-5" />
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
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-secondary font-mono">{formatBRL(item.price)}</p>
                                                    {item.original_price && item.original_price > item.price && (
                                                        <span className="text-[10px] line-through text-muted-foreground/50 font-mono">
                                                            {formatBRL(item.original_price)}
                                                        </span>
                                                    )}
                                                </div>
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

                        <div className="p-5 border-t-2 border-white/5 bg-black shrink-0">
                            {/* Subtotal Display */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="text-sm font-bold text-white/60 font-mono">
                                    {formatBRL(subtotal)}
                                </span>
                            </div>

                            {/* Discount Display */}
                            {discount > 0 && (
                                <div className="flex items-center justify-between mb-4 animate-in fade-in slide-in-from-right-4">
                                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">
                                        Desconto {(paymentMethod === 'pix' ? 'PIX' : 'Dinheiro')} ({activeDiscountPercentage}%)
                                    </span>
                                    <span className="text-sm font-bold text-primary font-mono">
                                        -{formatBRL(discount)}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4 pt-3 border-t border-white/10">
                                <span className="text-white font-bold uppercase tracking-widest text-xs">Total Final</span>
                                <span className="text-3xl font-bold text-primary font-mono">
                                    {formatBRL(finalTotal)}
                                </span>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="mb-4 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Forma de Pagamento:</label>
                                <div className="space-y-2">
                                    {[
                                        { id: 'pix', label: discountPercentage > 0 ? `PIX (${discountPercentage}% OFF)` : 'PIX' },
                                        { id: 'credit', label: 'Cartão de Crédito' },
                                        { id: 'cash', label: cashDiscountPercentage > 0 ? `Dinheiro / Entrega (${cashDiscountPercentage}% OFF)` : 'Dinheiro / Entrega' }
                                    ].map((method) => (
                                        <label key={method.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 border border-white/20 flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'bg-primary border-primary' : 'bg-transparent group-hover:border-white'}`}>
                                                {paymentMethod === method.id && <div className="w-2 h-2 bg-black" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm font-bold uppercase tracking-wide ${paymentMethod === method.id ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
                                                {method.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="mb-4 bg-white/5 border border-white/10 p-3 flex items-start gap-3">
                                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                                        Frete & Entrega
                                    </p>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                                        O valor do frete e os detalhes da entrega serão combinados diretamente pelo WhatsApp após o envio do pedido.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={items.length === 0}
                                className="w-full bg-primary hover:bg-white text-black font-black py-4 border-2 border-primary hover:border-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-[0_0_20px_-5px_rgba(190,242,100,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)]"
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
