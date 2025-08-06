
"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, LayoutDashboard, User, LogOut, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navLinks = [
    { href: "/events", label: "What's On" },
    { href: "/communities", label: "Communities" },
    { href: "/businesses", label: "Businesses" },
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
            "transition-colors hover:text-primary text-sm py-2",
            isActive ? "font-semibold text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </Link>
      );
    };

export default function MobileNav() {
    const { user, logout } = useAuth();

  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64">
        <nav className="flex flex-col space-y-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.profileImageUrl ? (
                        <AvatarImage src={user.profileImageUrl} alt={user.name} />
                      ) : (
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
                    {user.username && (
                      <DropdownMenuItem asChild>
                        <Link href={`/${user.username}`}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Public Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
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
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
           <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                    <li key={link.href}>
                        <NavLink {...link} />
                    </li>
                ))}
            </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
