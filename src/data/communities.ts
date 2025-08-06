
import type { Community } from "@/hooks/use-communities";

export const initialCommunities: Omit<Community, 'id' | 'createdAt' | 'updatedAt' | 'founderEmail'>[] = [
    {
        slug: "bay-area-tamil-sangam",
        name: "Bay Area Tamil Sangam",
        type: 'Cultural & Arts',
        description: "Promoting Tamil language and culture in the Bay Area through events and community service.",
        fullDescription: "Since its inception, the Bay Area Tamil Sangam has been a cornerstone for the Tamil-speaking community in Northern California. We are dedicated to preserving and promoting the rich heritage of Tamil language, literature, and culture. Through a variety of programs including cultural events, educational workshops, and community service initiatives, we aim to create a vibrant and supportive network for Tamils and friends of Tamil culture.",
        imageUrl: "https://images.unsplash.com/photo-1594917409245-8a245973c8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxJbmRpYW4lMjBmZXN0aXZhbCUyMGNyb3dkfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
        logoUrl: "https://placehold.co/200x200.png",
        region: "San Francisco Bay Area",
        membersCount: 1250,
        isVerified: true,
        founded: "1985",
        tags: ['cultural', 'tamil', 'bay-area', 'non-profit', 'family-friendly'],
        address: "PO Box 1234, Fremont, CA 94538",
        phone: "(510) 555-1234",
        contactEmail: "contact@bayareatamilsangam.org",
        website: "https://www.bayareatamilsangam.org",
        socialMedia: {
            twitter: "https://x.com/batamilsangam",
            facebook: "https://facebook.com/batamilsangam"
        },
        founderUid: "some-founder-uid"
    },
    // more communities...
];
