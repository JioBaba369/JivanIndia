
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DirectoryRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/businesses');
    }, [router]);

    return null;
}

    