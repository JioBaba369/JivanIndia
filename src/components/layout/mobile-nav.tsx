'use client';

import { Home, Users, Tag, User, Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { PostSheet } from './post-sheet';

const navItems = [
  { href: '/', label: 'Home', icon: Home, adminOnly: false },
  { href: '/communities', label: 'Communities', icon: Users, adminOnly: false },
  { href: 'post-sheet', label: 'Post', icon: Plus, isSheet: true, adminOnly: false },
  { href: '/deals', label: 'Deals', icon: Tag, adminOnly: false },
  { href: '/admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const getVisibleNavItems = () => {
    const baseItems = navItems.filter(item => !item.adminOnly);
    const profileOrLoginItem = {
        href: '/profile', 
        label: 'Profile', 
        icon: User, 
        auth: true 
    };
    
    if (user?.isAdmin) {
        // Find where the profile item should be and insert admin before it
        const adminItem = navItems.find(item => item.adminOnly);
        if (adminItem) {
            baseItems.push(adminItem);
        }
    }

    // Add profile/login item at the end
    const finalItems = [...baseItems, profileOrLoginItem];

    // Remove post sheet if not logged in
    if (!user) {
        return finalItems.filter(item => !item.isSheet);
    }
    
    return finalItems;
  }
  
  const visibleNavItems = getVisibleNavItems();


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="container grid h-16 items-center justify-around px-2" style={{ gridTemplateColumns: `repeat(${visibleNavItems.length}, 1fr)`}}>
        {visibleNavItems.map((item) => {
          if (item.auth && !user) {
            return (
                <Link
                    key='login-link'
                    href="/login"
                    className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                >
                    <User className="h-6 w-6" />
                    <span className="text-xs font-medium">Login</span>
                </Link>
            );
          }

          if (item.isSheet) {
            return (
              <div className="flex justify-center" key={item.href}>
                <PostSheet />
              </div>
            );
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors hover:text-primary',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
