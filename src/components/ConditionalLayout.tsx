"use client";

import { usePathname } from "next/navigation";

export default function ConditionalLayout({
    children,
    excludePaths = ["/admin", "/login"],
}: {
    children: React.ReactNode;
    excludePaths?: string[];
}) {
    const pathname = usePathname();
    const shouldExclude = excludePaths.some((path) => pathname?.startsWith(path));

    if (shouldExclude) {
        return null;
    }

    return <>{children}</>;
}
