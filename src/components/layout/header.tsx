
"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LayoutDashboard, User, LogOut, Heart, Menu } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import NotificationBell from "./notification-bell";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const mainNavLinks: { title: string; href: string; }[] = [
    { title: "Events", href: "/events" },
    { title: "Communities", href: "/communities" },
    { title: "Businesses", href: "/businesses" },
    { title: "Movies", href: "/movies" },
    { title: "Deals", href: "/deals" },
    { title: "Careers", href: "/careers" },
];


const UserActions = React.memo(function UserActionsMemo({ onLinkClick }: { onLinkClick?: () => void }) {
  const { user, logout } = useAuth();
  
  const handleItemClick = (e: React.MouseEvent) => {
    if (onLinkClick) {
        onLinkClick();
    }
  };

  if (user) {
    const isAdmin = user.roles?.includes('admin');
    return (
      <div className="flex items-center gap-1">
        <NotificationBell />
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
              <DropdownMenuItem asChild onClick={handleItemClick}>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              {user.username && <DropdownMenuItem asChild onClick={handleItemClick}>
                <Link href={`/${user.username}`}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Public Profile</span>
                </Link>
              </DropdownMenuItem>}
               <DropdownMenuItem asChild onClick={handleItemClick}>
                  <Link href="/profile">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>My Saved Items</span>
                  </Link>
                </DropdownMenuItem>
              {isAdmin && <DropdownMenuItem asChild onClick={handleItemClick}><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { handleItemClick; logout(); }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild onClick={handleItemClick}>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild onClick={handleItemClick}>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );
});


export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-auto flex items-center gap-6">
            <Logo as={Link} href="/" />
             <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                    {mainNavLinks.map((link) => (
                        <NavigationMenuItem key={link.href}>
                            <Link href={link.href} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    {link.title}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="hidden md:flex">
                <UserActions />
            </div>
            <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs p-6">
                    <div className="mt-6 flex flex-col space-y-4">
                        <UserActions onLinkClick={() => setIsOpen(false)} />
                        <DropdownMenuSeparator />
                        <nav className="flex flex-col space-y-2">
                             <SheetClose asChild><Link href="/" className="text-lg font-medium">Home</Link></SheetClose>
                             {mainNavLinks.map((link) => (
                               <SheetClose asChild key={link.href}><Link href={link.href} className="text-muted-foreground hover:text-primary">{link.title}</Link></SheetClose>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
