
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProvidersRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/businesses');
    }, [router]);

    return null;
}
