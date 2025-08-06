
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProvidersRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/directory');
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <p>Redirecting...</p>
        </div>
    );
}
