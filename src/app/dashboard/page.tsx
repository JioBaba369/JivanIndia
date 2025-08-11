
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useAbout } from '@/hooks/use-about';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { aboutContent, isLoading: isAboutLoading } = useAbout();
  const router = useRouter();

  useEffect(() => {
    const isLoading = isAuthLoading || isAboutLoading;
    if (isLoading) {
      return; 
    }

    if (!user) {
      router.replace('/login');
      return;
    }
    
    const isAdmin = aboutContent.adminUids.includes(user.uid);
    
    if (isAdmin) {
      router.replace('/admin');
    } else if (user.affiliation?.orgSlug) {
      router.replace(`/c/${user.affiliation.orgSlug}`);
    } else if (user.username) {
      router.replace(`/${user.username}`);
    } else {
      router.replace('/profile');
    }
    
  }, [user, isAuthLoading, aboutContent, isAboutLoading, router]);

  return (
    <div className="flex h-[calc(100vh-128px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
