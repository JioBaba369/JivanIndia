
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useCommunities } from '@/hooks/use-communities';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isLoading: areCommunitiesLoading } = useCommunities();
  const router = useRouter();

  useEffect(() => {
    // Wait until both authentication and communities data are fully resolved
    if (isAuthLoading || areCommunitiesLoading) {
      return; 
    }

    // If there's no user, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is loaded, proceed with redirection logic
    if (user.isAdmin) {
      router.push('/admin');
    } else if (user.affiliation?.orgSlug) {
      // This is the key check: ensure orgSlug is defined before redirecting
      router.push(`/c/${user.affiliation.orgSlug}`);
    } else {
      // If user has no affiliation, go to their profile page.
      router.push('/profile');
    }
    
  }, [user, isAuthLoading, areCommunitiesLoading, router]);

  return (
    <div className="flex h-[calc(100vh-128px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
