
'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AnalyticsCard from '@/components/feature/analytics-card';
import { Users, CalendarCheck, BarChart2, TrendingUp, TrendingDown, ArrowRight, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCommunities } from '@/hooks/use-communities';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Community } from '@/hooks/use-communities';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const memberData = [
  { month: 'Jan', members: 186 },
  { month: 'Feb', members: 305 },
  { month: 'Mar', members: 237 },
  { month: 'Apr', members: 73 },
  { month: 'May', members: 209 },
  { month: 'Jun', members: 214 },
];

const eventPerformanceData = [
    { name: 'Diwali Gala', registrations: 240, attendance: 190 },
    { name: 'Holi Fest', registrations: 300, attendance: 250 },
    { name: 'Startup Meet', registrations: 150, attendance: 120 },
    { name: 'Food Fair', registrations: 400, attendance: 350 },
    { name: 'Charity Run', registrations: 500, attendance: 450 },
];

const topReferrersData = [
    { source: 'Direct Link', count: 450, percentage: 45 },
    { source: 'Google Search', count: 250, percentage: 25 },
    { source: 'Facebook', count: 150, percentage: 15 },
    { source: 'Instagram', count: 100, percentage: 10 },
    { source: 'Other', count: 50, percentage: 5 },
];

export default function AnalyticsDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const slug = typeof params.slug === 'string' ? params.slug : '';
    const { getCommunityBySlug, isLoading: areCommunitiesLoading } = useCommunities();
    const [community, setCommunity] = useState<Community | null>(null);

    useEffect(() => {
        if (slug && !areCommunitiesLoading) {
            const foundCommunity = getCommunityBySlug(slug);
            setCommunity(foundCommunity || null);
        }
    }, [slug, getCommunityBySlug, areCommunitiesLoading]);
    
    // Authorization check
    if (isAuthLoading || areCommunitiesLoading) {
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
    

    const memberChartConfig = {
        members: { label: 'New Members', color: 'hsl(var(--primary))' },
    };

     const eventChartConfig = {
        attendance: { label: 'Attendance', color: 'hsl(var(--primary))' },
        registrations: { label: 'Registrations', color: 'hsl(var(--muted-foreground))' },
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <AnalyticsCard
                        title="Total Members"
                        value={community?.membersCount.toLocaleString() || 'N/A'}
                        change="+22% from last month"
                        icon={<Users />}
                        trend={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                    />
                    <AnalyticsCard
                        title="Active Members"
                        value="670"
                        change="-5% this week"
                        icon={<Users className="text-green-500"/>}
                         trend={<TrendingDown className="h-4 w-4 text-destructive" />}
                    />
                     <AnalyticsCard
                        title="Events This Month"
                        value="4"
                        change="+2 from last month"
                        icon={<CalendarCheck />}
                        trend={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                    />
                    <AnalyticsCard
                        title="Engagement Rate"
                        value="57%"
                        change="+3% from last month"
                        icon={<BarChart2 />}
                        trend={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                    />
                </div>

                {/* Charts */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Member Growth</CardTitle>
                            <CardDescription>New members in the last 6 months.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {memberData.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ChartContainer config={memberChartConfig}>
                                    <BarChart data={memberData} accessibilityLayer>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="members" fill="var(--color-members)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                           ) : (
                            <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-center p-4">
                                <div>
                                <p>No member data to display.</p>
                                <p className="text-xs mt-1">This chart will populate as new users join your community.</p>
                                </div>
                            </div>
                           )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Performance</CardTitle>
                            <CardDescription>Registration vs. Attendance for recent events.</CardDescription>
                        </CardHeader>
                         <CardContent>
                          {eventPerformanceData.length > 0 ? (
                             <div className="h-[300px] w-full">
                                <ChartContainer config={eventChartConfig}>
                                    <LineChart data={eventPerformanceData} accessibilityLayer>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <YAxis />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="registrations" stroke="var(--color-registrations)" strokeWidth={2} dot={false}/>
                                        <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} dot={false}/>
                                    </LineChart>
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
                
                 <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Referrers</CardTitle>
                            <CardDescription>Where your new members are coming from.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {topReferrersData.length > 0 ? (
                            <div className="space-y-4">
                                {topReferrersData.map((referrer) => (
                                    <div key={referrer.source} className="flex items-center">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground mr-2" />
                                        <span className="flex-1 font-medium">{referrer.source}</span>
                                        <span className="text-muted-foreground">{referrer.count} members</span>
                                        <div className="w-24 ml-4 h-2 bg-muted rounded-full">
                                            <div className="h-2 bg-primary rounded-full" style={{width: `${referrer.percentage}%`}}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                           ) : (
                              <div className="h-[100px] w-full flex items-center justify-center text-muted-foreground text-center p-4">
                                  <div>
                                    <p>No referrer data to display.</p>
                                    <p className="text-xs mt-1">Referral tracking is not yet implemented.</p>
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
