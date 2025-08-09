
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
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ListItem } from "@/components/ui/navigation-menu";

const forYouLinks: { title: string; href: string; description: string }[] = [
    { title: "Events", href: "/events", description: "Discover cultural celebrations and professional meetups." },
    { title: "Movies", href: "/movies", description: "Catch the latest Bollywood and regional hits near you." },
    { title: "Deals", href: "/deals", description: "Exclusive offers from businesses in our community." },
    { title: "Careers", href: "/careers", description: "Find your next role in our community-focused job board." },
];

const forBusinessLinks: { title: string; href: string; description: string }[] = [
    { title: "Communities", href: "/communities", description: "Find and connect with cultural and professional groups." },
    { title: "Businesses", href: "/businesses", description: "List your business in our community directory." },
    { title: "Sponsors", href: "/sponsors", description: "Support the community and gain visibility as a sponsor." },
];

const resourcesLinks: { title: string; href: string; description: string }[] = [
    { title: "About Us", href: "/about", description: "Learn more about our mission and the team." },
    { title: "About India", href: "/india", description: "Explore the roots and culture of the Indian diaspora." },
    { title: "Festivals", href: "/festivals", description: "A calendar of important Indian festivals and dates." },
    { title: "Contact Us", href: "/contact", description: "Get in touch with the JivanIndia.co team." },
];


const UserActions = React.memo(function UserActionsMemo() {
  const { user, logout } = useAuth();
  
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
                    <span>My Saved Items</span>
                  </Link>
                </DropdownMenuItem>
              {isAdmin && <DropdownMenuItem asChild><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
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
      <Button variant="ghost" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild>
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
                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Home
                        </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>For You</NavigationMenuTrigger>
                        <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {forYouLinks.map((component) => (
                            <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                            >
                                {component.description}
                            </ListItem>
                            ))}
                        </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                     <NavigationMenuItem>
                        <NavigationMenuTrigger>For Business</NavigationMenuTrigger>
                        <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {forBusinessLinks.map((component) => (
                            <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                            >
                                {component.description}
                            </ListItem>
                            ))}
                        </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                        <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {resourcesLinks.map((component) => (
                            <ListItem
                                key={component.title}
                                title={component.title}
                                href={component.href}
                            >
                                {component.description}
                            </ListItem>
                            ))}
                        </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
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
                        <div onClick={() => setIsOpen(false)}>
                            <UserActions />
                        </div>
                        <DropdownMenuSeparator />
                        <nav className="flex flex-col space-y-2">
                             <SheetClose asChild><Link href="/" className="text-lg font-medium">Home</Link></SheetClose>
                            <h4 className="font-semibold pt-4">For You</h4>
                            {forYouLinks.map((link) => (
                               <SheetClose asChild key={link.href}><Link href={link.href} className="text-muted-foreground hover:text-primary">{link.title}</Link></SheetClose>
                            ))}
                            <h4 className="font-semibold pt-4">For Business</h4>
                             {forBusinessLinks.map((link) => (
                                <SheetClose asChild key={link.href}><Link href={link.href} className="text-muted-foreground hover:text-primary">{link.title}</Link></SheetClose>
                            ))}
                            <h4 className="font-semibold pt-4">Resources</h4>
                             {resourcesLinks.map((link) => (
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
