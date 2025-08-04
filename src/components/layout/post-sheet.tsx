
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone, Building2, Tag, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

const postOptions = [
  { href: '/events/new', label: 'Post an Event', icon: Megaphone },
  { href: '/communities/new', label: 'Register a Community', icon: Building2 },
  { href: '/deals/new', label: 'Create a Deal', icon: Tag },
  { href: '/careers/new', label: 'Post a Job', icon: Briefcase },
];

export function PostSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleLinkClick = () => {
    setIsOpen(false);
  };
  
  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Post</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-lg">
        <SheetHeader className="text-center">
          <SheetTitle className="font-headline">Create a new post</SheetTitle>
          <SheetDescription>What would you like to share with the community?</SheetDescription>
        </SheetHeader>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {postOptions.map((option) => (
            <Button
              key={option.href}
              asChild
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={handleLinkClick}
            >
              <Link href={option.href}>
                <option.icon className="h-8 w-8" />
                <span>{option.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
