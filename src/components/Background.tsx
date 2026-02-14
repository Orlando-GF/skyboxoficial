"use client";

export default function Background() {
    return (
        <>
            {/* Background Ambience - Obsidian Deep Pure */}
            <div className="fixed inset-0 z-[-1] bg-background pointer-events-none" />

            {/* Subtle Noise/Texture Overlay for Industrial Feel */}
            <div className="fixed inset-0 z-[-1] opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Optional: Add a subtle global gradient vignette if desired for depth */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
        </>
    );
}
