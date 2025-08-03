
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.isAdmin) {
      router.push('/admin');
    } else if (user.affiliation?.orgId) {
      router.push(`/communities/${user.affiliation.orgId}`);
    } else {
      router.push('/profile');
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-[calc(100vh-128px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
