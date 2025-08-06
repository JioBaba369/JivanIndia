
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LayoutDashboard, User, LogOut, Heart, Users } from "lucide-react";
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
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

const navLinks = [
  { href: "/events", label: "What's On" },
  { href: "/communities", label: "Communities" },
  { href: "/directory", label: "Directory" },
  { href: "/movies", label: "Movies" },
  { href: "/deals", label: "Deals" },
  { href: "/careers", label: "Careers" },
];

const NavLink = ({ href, label, onClick }: { href: string; label: string, onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href) && (href !== "/" || pathname === "/");
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "transition-colors hover:text-primary text-sm",
          isActive ? "font-semibold text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

const UserActions = () => {
  const { user, logout } = useAuth();
  
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
        <DropdownMenuContent align="end" className="w-56">
           <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
             <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
             {user.username && <DropdownMenuItem asChild>
              <Link href={`/${user.username}`}>
                <User className="mr-2 h-4 w-4" />
                <span>Public Profile</span>
              </Link>
            </DropdownMenuItem>}
             <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Saved Items</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Users className="mr-2 h-4 w-4" />
                  <span>My Communities</span>
                </Link>
              </DropdownMenuItem>
            {user.isAdmin && <DropdownMenuItem asChild><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
             <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );
};


export default function Header() {
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
            <Logo as={Link} href="/" />
            <nav className="hidden items-center space-x-6 md:flex">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>
        </div>
        <div className="hidden items-center space-x-2 md:flex">
          <UserActions />
        </div>
      </div>
    </header>
  );
}
