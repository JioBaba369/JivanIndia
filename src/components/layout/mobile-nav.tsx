
'use client';

import { Home, Users, Tag, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { PostSheet } from './post-sheet';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/communities', label: 'Communities', icon: Users },
  { href: 'post-sheet', label: 'Post', icon: Plus, isSheet: true },
  { href: '/deals', label: 'Deals', icon: Tag },
  { href: '/profile', label: 'Profile', icon: User, auth: true },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="container flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
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
            return <PostSheet key={item.href} />;
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
