
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCommunities } from '@/hooks/use-communities';

export default function LegacyCommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const { getCommunityById } = useCommunities();
  const community = getCommunityById(id);

  useEffect(() => {
    if (community?.slug) {
      router.replace(`/c/${community.slug}`);
    } else if (id) {
      // Small delay to allow communities to load, then redirect if still not found
      const timer = setTimeout(() => {
          router.replace('/communities');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [community, router, id]);

  // Render a loading state or nothing while redirecting
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p>Redirecting...</p>
    </div>
  );
}
