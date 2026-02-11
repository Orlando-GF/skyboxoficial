"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cloud } from "lucide-react";
import { STORAGE_KEYS } from "@/constants";

export default function AgeGate() {
    const [showGate, setShowGate] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isVerified = localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED);
        if (isVerified !== "true") {
            setShowGate(true);
        }
    }, []);

    const handleVerify = () => {
        localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, "true");
        setShowGate(false);
    };

    const handleReject = () => {
        window.location.href = "https://www.google.com";
    };

    if (!showGate) return null;

    return (
        <AnimatePresence>
            {showGate && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 blur-[100px] rounded-full" />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="relative">
                                <Cloud className="w-16 h-16 text-secondary animate-pulse" />
                                <ShieldCheck className="w-8 h-8 text-primary absolute -bottom-2 -right-2 bg-black rounded-full p-1" />
                            </div>

                            <div>
                                <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-wider">
                                    SKYBOX
                                </h1>
                                <p className="text-muted text-sm">
                                    ACESSO RESTRITO PARA MAIORES DE 18 ANOS
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <button
                                    onClick={handleVerify}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(255,0,127,0.3)] hover:shadow-[0_0_30px_rgba(255,0,127,0.5)]"
                                >
                                    SIM, SOU MAIOR DE 18
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-muted hover:text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-95"
                                >
                                    NÃO, SOU MENOR
                                </button>
                            </div>

                            <p className="text-xs text-muted/50">
                                Ao entrar, você concorda com nossos termos.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
