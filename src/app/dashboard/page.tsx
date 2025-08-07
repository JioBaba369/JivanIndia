
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useAbout } from '@/hooks/use-about';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading, updateUser } = useAuth();
  const { aboutContent, isLoading: isAboutLoading } = useAbout();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading || isAboutLoading) {
      return; 
    }

    if (!user) {
      router.push('/login');
      return;
    }
    
    const isAdmin = aboutContent.adminUids.includes(user.uid);
    
    // Update user object if admin status has changed
    if (user.isAdmin !== isAdmin) {
        updateUser({ isAdmin });
    }

    if (isAdmin) {
      router.push('/admin');
    } else if (user.affiliation?.orgSlug) {
      router.push(`/c/${user.affiliation.orgSlug}`);
    } else {
      router.push('/profile');
    }
    
  }, [user, isAuthLoading, isAboutLoading, aboutContent.adminUids, router, updateUser]);

  return (
    <div className="flex h-[calc(100vh-128px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
