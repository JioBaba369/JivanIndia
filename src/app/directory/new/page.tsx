
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DirectoryNewRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/businesses/new');
    }, [router]);

    return null;
}
