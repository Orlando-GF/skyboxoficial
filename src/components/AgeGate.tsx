"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud } from "lucide-react";
import { STORAGE_KEYS } from "@/constants";

export default function AgeGate() {
    const [showGate, setShowGate] = useState(false);

    useEffect(() => {
        const isVerified = localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED);
        if (isVerified !== "true") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 0 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-md bg-black border-2 border-primary p-8 md:p-12 text-center relative overflow-y-auto max-h-[90vh] no-scrollbar"
                    >
                        <style jsx>{`
                            .no-scrollbar::-webkit-scrollbar { display: none; }
                            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                        `}</style>
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 blur-[100px] rounded-full" />

                        <div className="relative z-10 flex flex-col items-center gap-10">
                            <div className="relative">
                                <Cloud className="w-16 h-16 text-primary" />
                                <div className="absolute -bottom-2 -right-2 bg-primary text-black p-2 font-black text-xs">18+</div>
                            </div>

                            <div>
                                <h1 className="text-5xl font-display font-bold text-white mb-2 tracking-tighter uppercase">
                                    SKYBOX
                                </h1>
                                <p className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
                                    VERIFICAÇÃO DE PROTOCOLO OBRIGATÓRIA
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <button
                                    onClick={handleVerify}
                                    className="w-full bg-primary text-black font-black py-4 px-8 hover:bg-white transition-all uppercase tracking-widest text-xs"
                                >
                                    AUTORIZAR ACESSO
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="w-full bg-transparent border-2 border-white/20 hover:border-white text-white font-bold py-4 px-8 transition-all uppercase tracking-widest text-xs"
                                >
                                    ABORTAR SISTEMA
                                </button>
                            </div>

                            <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest mt-4">
                                Ao entrar, você concorda com nossos <a href="/termos" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">termos de acesso</a>.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
