
'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Loader2, type LucideIcon } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  const getIcon = (iconName: keyof typeof LucideIcons) => {
    const Icon = LucideIcons[iconName] as LucideIcon;
    return Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : <Bell className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <CardTitle className="font-headline text-lg">Notifications</CardTitle>
                {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        <CheckCheck className="mr-2 h-4 w-4"/>
                        Mark all as read
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-80">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                       <Loader2 className="h-6 w-6 animate-spin"/>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y">
                    {notifications.map(n => (
                        <Link
                            key={n.id}
                            href={n.link}
                            className={cn(
                                "flex items-start gap-4 p-4 hover:bg-accent",
                                !n.isRead && "bg-primary/5"
                            )}
                            onClick={() => !n.isRead && markAsRead(n.id)}
                        >
                            <div className="mt-1">{getIcon(n.icon)}</div>
                            <div className="flex-grow">
                                <p className="font-semibold">{n.title}</p>
                                <p className="text-sm text-muted-foreground">{n.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(n.createdAt.toDate()), { addSuffix: true })}
                                </p>
                            </div>
                            {!n.isRead && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                        </Link>
                    ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
                        <p>You have no notifications yet.</p>
                    </div>
                )}
                </ScrollArea>
            </CardContent>
             <CardFooter className="p-2 border-t">
                <Button variant="link" className="w-full" asChild>
                    <Link href="#">View all notifications</Link>
                </Button>
            </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
