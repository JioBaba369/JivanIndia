
'use client';

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DirectoryIdRedirectPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        if(id) {
            router.replace(`/businesses/${id}`);
        } else {
            router.replace('/businesses');
        }
    }, [router, id]);

    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <p>Redirecting...</p>
        </div>
    );
}
