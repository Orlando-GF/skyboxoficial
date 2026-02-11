export const runtime = 'edge';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050510] text-white px-4">
            <h1 className="text-6xl font-display font-bold mb-4">404</h1>
            <p className="text-xl text-slate-400 mb-8 text-center">Ops! Essa fumaça te levou para o lugar errado.</p>
            <Link
                href="/"
                className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-full font-bold transition-all active:scale-95"
            >
                Voltar para a Loja
            </Link>
        </div>
    );
}
