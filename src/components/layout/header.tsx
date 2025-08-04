
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../logo";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  { href: "/", label: "What's On" },
  { href: "/communities", label: "Communities" },
  { href: "/movies", label: "Movies" },
  { href: "/deals", label: "Deals" },
  { href: "/careers", label: "Careers" },
];

const NavLink = ({ href, label, onClick }: { href: string; label: string, onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "transition-colors hover:text-primary",
          isActive ? "font-semibold text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

const UserActions = ({ onAction }: { onAction?: () => void }) => {
  const { user, logout, getInitials } = useAuth();
  
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {user.profileImageUrl ? <AvatarImage src={user.profileImageUrl} alt={user.name} /> : <AvatarFallback>{getInitials(user.name)}</AvatarFallback>}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild onClick={onAction}><Link href="/profile">My Profile</Link></DropdownMenuItem>
          {user.username && <DropdownMenuItem asChild onClick={onAction}><Link href={`/${user.username}`}>View Public Profile</Link></DropdownMenuItem>}
          {user.isAdmin && <DropdownMenuItem asChild onClick={onAction}><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { logout(); if(onAction) onAction(); }}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/login" onClick={onAction}>Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup" onClick={onAction}>Sign Up</Link>
      </Button>
    </div>
  );
};


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo as={Link} href="/" />
        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="hidden items-center space-x-2 md:flex">
          <UserActions />
        </div>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
               <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <Logo as={Link} href="/" onClick={() => setIsMobileMenuOpen(false)} />
               </SheetHeader>
              <div className="p-4 pt-0">
                <nav className="mt-8 flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} onClick={() => setIsMobileMenuOpen(false)}/>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col space-y-2 border-t pt-6">
                   <UserActions onAction={() => setIsMobileMenuOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
