
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DirectoryRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/businesses');
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <p>Redirecting...</p>
        </div>
    );
}
