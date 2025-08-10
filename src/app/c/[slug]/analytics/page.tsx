
'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AnalyticsCard from '@/components/feature/analytics-card';
import { Users, CalendarCheck, BarChart2, TrendingUp, TrendingDown, ArrowRight, Link as LinkIcon, AlertCircle, Loader2, Ticket } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCommunities } from '@/hooks/use-communities';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import type { Community } from '@/hooks/use-communities';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEvents } from '@/hooks/use-events';
import { format, subMonths, getMonth, getYear } from 'date-fns';

export default function AnalyticsDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : '';
    const { getCommunityBySlug, isLoading: areCommunitiesLoading } = useCommunities();
    const { events, isLoading: areEventsLoading } = useEvents();
    const [community, setCommunity] = useState<Community | null>(null);

    useEffect(() => {
        if (slug && !areCommunitiesLoading) {
            const foundCommunity = getCommunityBySlug(slug);
            setCommunity(foundCommunity || null);
        }
    }, [slug, getCommunityBySlug, areCommunitiesLoading]);
    
    const communityEvents = useMemo(() => {
        if (!community) return [];
        return events.filter(event => event.organizerId === community.id);
    }, [community, events]);

    const totalEventsCreated = communityEvents.length;
    const totalEventRegistrations = useMemo(() => {
        return communityEvents.reduce((acc, event) => acc + (event.attendees || 0), 0);
    }, [communityEvents]);

    const eventsOverTimeData = useMemo(() => {
        const monthMap = new Map<string, number>();
        const last12Months: { month: string, events: number }[] = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
            const date = subMonths(now, i);
            const monthKey = format(date, 'MMM yy');
            monthMap.set(monthKey, 0);
        }

        communityEvents.forEach(event => {
            if (event.createdAt?.toDate) {
                const eventDate = event.createdAt.toDate();
                const monthKey = format(eventDate, 'MMM yy');
                if (monthMap.has(monthKey)) {
                    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
                }
            }
        });
        
        monthMap.forEach((count, month) => {
            last12Months.push({ month, events: count });
        });
        
        return last12Months;
    }, [communityEvents]);

    const eventPerformanceData = useMemo(() => {
        return communityEvents
            .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
            .slice(0, 5)
            .map(event => ({
                name: event.title,
                registrations: event.attendees || 0
            }))
            .reverse();
    }, [communityEvents]);
    
    // Authorization check
    if (isAuthLoading || areCommunitiesLoading || areEventsLoading) {
      return (
        <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!user || !community || user.uid !== community.founderUid) {
        return (
             <div className="container mx-auto px-4 py-12 text-center">
                <Card className="mx-auto max-w-md">
                    <CardHeader>
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                        <CardTitle className="font-headline text-3xl mt-4">Access Denied</CardTitle>
                        <CardDescription>You do not have permission to view this page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href={`/c/${slug}`}>Back to Community</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    

    const eventsChartConfig = {
        events: { label: 'New Events', color: 'hsl(var(--primary))' },
    };

     const eventPerformanceChartConfig = {
        registrations: { label: 'Registrations', color: 'hsl(var(--primary))' },
    };

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-headline text-4xl font-bold">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">Insights for {community?.name || 'your community'}.</p>
                    </div>
                    <Button asChild>
                        <Link href={`/c/${slug}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            View Community Page
                        </Link>
                    </Button>
                </div>
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnalyticsCard
                        title="Total Members"
                        value={community?.membersCount.toLocaleString() || 'N/A'}
                        change="All-time members"
                        icon={<Users />}
                        trend={<Users className="h-4 w-4 text-muted-foreground" />}
                    />
                     <AnalyticsCard
                        title="Events Created"
                        value={totalEventsCreated.toString()}
                        change="All-time events"
                        icon={<CalendarCheck />}
                        trend={<CalendarCheck className="h-4 w-4 text-muted-foreground" />}
                    />
                    <AnalyticsCard
                        title="Total Event Registrations"
                        value={totalEventRegistrations.toLocaleString()}
                        change="All-time attendees"
                        icon={<Ticket />}
                        trend={<Ticket className="h-4 w-4 text-muted-foreground" />}
                    />
                </div>

                {/* Charts */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Events Over Time</CardTitle>
                            <CardDescription>New events created in the last 12 months.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {eventsOverTimeData.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ChartContainer config={eventsChartConfig}>
                                    <BarChart data={eventsOverTimeData} accessibilityLayer>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="events" fill="var(--color-events)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                           ) : (
                            <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-center p-4">
                                <div>
                                <p>No event data to display.</p>
                                <p className="text-xs mt-1">This chart will populate as you create new events.</p>
                                </div>
                            </div>
                           )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Event Performance</CardTitle>
                            <CardDescription>Registrations for your 5 most recent events.</CardDescription>
                        </CardHeader>
                         <CardContent>
                          {eventPerformanceData.length > 0 ? (
                             <div className="h-[300px] w-full">
                                <ChartContainer config={eventPerformanceChartConfig}>
                                    <BarChart data={eventPerformanceData} accessibilityLayer>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 8) + (value.length > 8 ? '...' : '')}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="registrations" fill="var(--color-registrations)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                            ) : (
                               <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-center p-4">
                                   <div>
                                    <p>No event data to display.</p>
                                    <p className="text-xs mt-1">This chart requires event attendance tracking.</p>
                                   </div>
                               </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
