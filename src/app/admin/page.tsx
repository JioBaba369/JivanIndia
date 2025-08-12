
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type User } from '@/hooks/use-auth';
import { useEvents, type Event } from '@/hooks/use-events';
import { useCommunities, type Community } from '@/hooks/use-communities';
import { useAbout, type TeamMember, type AboutContent } from '@/hooks/use-about';
import { useBusinesses } from '@/hooks/use-businesses';
import { useReports } from '@/hooks/use-reports';
import { useMovies } from '@/hooks/use-movies';
import { useDeals } from '@/hooks/use-deals';
import { useJobs } from '@/hooks/use-jobs';
import { useSponsors } from '@/hooks/use-sponsors';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { ShieldCheck, CheckCircle2, Edit, Trash2, UserPlus, Archive, Check, UserX, Loader2, Star, Settings, Users, FileText, Image as ImageIcon, AlertTriangle, ClipboardCheck, Film, Tag, Briefcase, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getInitials } from '@/lib/utils';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountrySelector from '@/components/layout/country-selector';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ImageUpload = dynamic(() => import('@/components/feature/image-upload'), {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false,
});

interface ChecklistItemProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

const ChecklistItem = ({ id, label, description, checked, onToggle }: ChecklistItemProps) => (
  <div className="flex items-start gap-4 rounded-md border p-4 transition-all hover:bg-accent">
    <Checkbox id={id} checked={checked} onCheckedChange={() => onToggle(id)} className="mt-1" />
    <div className="grid gap-1.5 leading-none">
      <Label htmlFor={id} className="text-base font-medium">
        {label}
      </Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const checklistData = {
  readiness: [
    { id: 'c1', label: 'Final Data Wipe', description: 'All sample events, communities, users (except initial admin), etc., have been cleared from the database.' },
    { id: 'c2', label: 'Favicon & Branding', description: 'Site logo and favicon are finalized and configured in the admin panel.' },
    { id: 'c3', label: 'Domain & Hosting', description: 'Firebase Hosting is connected to the final production domain (jivanindia.co).' },
    { id: 'c4', label: 'Environment Variables', description: 'All necessary environment variables for production are set in the deployment configuration.' },
  ],
  functionality: [
    { id: 'f1', label: 'User Authentication', description: 'Users can successfully sign up, log in, and log out.' },
    { id: 'f2', label: 'Profile Management', description: 'Users can create, view, and update their public and private profiles.' },
    { id: 'f3', label: 'Community Management', description: 'Users can create, edit, and manage their own community pages.' },
    { id: 'f4', label: 'Content Creation', description: 'Affiliated users can create new events, deals, and job postings.' },
    { id: 'f5', label: 'Save & Join System', description: 'Users can save events/deals and join communities, with changes reflected in their profile.' },
    { id: 'f6', label: 'Reporting System', description: 'Users can report content, and reports appear correctly in the admin dashboard.' },
  ],
  ui: [
    { id: 'u1', label: 'Responsive Design', description: 'All pages are tested and visually correct on desktop, tablet, and mobile screen sizes.' },
    { id: 'u2', label: 'Navigation Consistency', description: 'Header and footer navigation is consistent and links to all correct pages.' },
    { id: 'u3', label: 'Empty State Handling', description: 'All list pages (Events, Deals, etc.) show a user-friendly message when there is no data.' },
    { id: 'u4', label: 'Error Handling', description: 'Application gracefully handles 404 Not Found, general errors, and data loading states.' },
  ],
  content: [
    { id: 'cd1', label: 'Real-time Updates', description: 'Data across the app (events, communities) updates in real-time without page reloads.' },
    { id: 'cd2', label: 'Date & Time Handling', description: 'All dates and times are correctly handled and displayed across different timezones.' },
    { id: 'cd3', label: 'Static Content Review', description: 'All static content (About Us, India, Festivals, Legal pages) is proofread and finalized.' },
    { id: 'cd4', label: 'Image Placeholders', description: 'All placeholder images have been replaced with final, high-quality images.' },
  ],
  admin: [
    { id: 'a1', label: 'Content Moderation', description: 'Admins can approve/archive events and verify/feature communities and businesses.' },
    { id: 'a2', label: 'User Management', description: 'Admins can add/remove other platform administrators.' },
    { id: 'a3', label: 'Team Management', description: 'Admins can add, edit, and remove team members displayed on the About Us page.' },
    { id: 'a4', label: 'Report Moderation', description: 'Admins can view and resolve user-submitted reports.' },
  ],
  technical: [
    { id: 't1', label: 'Sitemap Generation', description: 'The sitemap.ts file correctly generates URLs for all static and dynamic pages.' },
    { id: 't2', label: 'Security Rules', description: 'Firestore security rules are in place and have been tested to protect user data.' },
    { id: 't3', label: 'Dependencies', description: 'All package.json dependencies are up-to-date and free of known major vulnerabilities.' },
    { id: 't4', label: 'Analytics Configuration', description: 'Firebase Analytics is correctly configured and tracking page views.' },
  ],
};

const TeamMemberDialog = ({
  member,
  onSave,
  children,
}: {
  member?: TeamMember | null;
  onSave: (data: Omit<TeamMember, 'id' | 'avatarUrl'>) => void;
  children: React.ReactNode;
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setName(member.name);
        setRole(member.role);
        setBio(member.bio);
      } else {
        setName('');
        setRole('');
        setBio('');
      }
    }
  }, [isOpen, member]);

  const handleSave = () => {
    if (!name || !role) {
      toast({ title: "Validation Error", description: "Name and role are required.", variant: "destructive" });
      return;
    }
    onSave({ name, role, bio });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={member?.avatarUrl} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Enter role" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Enter bio" rows={4} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AddAdminDialog = ({ onSave }: { onSave: (email: string) => Promise<void> }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!email) {
      toast({ title: "Validation Error", description: "Email is required.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(email);
      setIsOpen(false);
      setEmail('');
    } catch (error) {
      toast({ title: "Error", description: "Failed to add admin. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><UserPlus className="mr-2 h-4 w-4" /> Add Admin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Administrator</DialogTitle>
          <CardDescription>Enter the email address of the user to grant admin privileges.</CardDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="email">User Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Grant Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ALL_COUNTRIES_VALUE = 'All Countries';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();
  const { events, updateEventStatus, updateEventFeaturedStatus } = useEvents();
  const { communities, verifyCommunity, updateCommunityFeaturedStatus } = useCommunities();
  const { aboutContent, updateAboutContent, addTeamMember, updateTeamMember, deleteTeamMember, addAdmin, removeAdmin, isLoading: isAboutLoading } = useAbout();
  const { businesses, verifyBusiness, updateBusinessFeaturedStatus } = useBusinesses();
  const { reports, updateReportStatus, isLoading: isReportsLoading } = useReports();
  const { movies } = useMovies();
  const { deals } = useDeals();
  const { jobs } = useJobs();
  const { sponsors } = useSponsors();
  const { toast } = useToast();

  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [story, setStory] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [countryFilter, setCountryFilter] = useState(ALL_COUNTRIES_VALUE);
  const [sponsorCountFilter, setSponsorCountFilter] = useState('all');
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  const hasAdminRole = useMemo(() => user ? aboutContent.adminUids.includes(user.uid) : false, [user, aboutContent]);
  
  useEffect(() => {
    if (isAuthLoading || isAboutLoading) {
        return; 
    }
    if (!user || !hasAdminRole) {
      toast({ title: "Access Denied", description: "You do not have admin privileges.", variant: "destructive" });
      router.push('/');
    }
  }, [user, isAuthLoading, hasAdminRole, router, toast, isAboutLoading]);

  useEffect(() => {
    if (user && hasAdminRole && aboutContent.adminUids.length > 0) {
      const fetchAdminUsers = async () => {
        setIsUsersLoading(true);
        try {
          const usersRef = collection(firestore, 'users');
          const adminUids = aboutContent.adminUids;
          const adminUsersData: User[] = [];

          for (let i = 0; i < adminUids.length; i += 30) {
            const chunk = adminUids.slice(i, i + 30);
            if (chunk.length > 0) {
              const q = query(usersRef, where('__name__', 'in', chunk));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                adminUsersData.push({ ...doc.data(), uid: doc.id } as User);
              });
            }
          }
          
          setAdminUsers(adminUsersData.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
          console.error("Failed to fetch admin users", error);
          toast({ title: 'Error', description: 'Could not fetch admin user list.', variant: 'destructive' });
        } finally {
          setIsUsersLoading(false);
        }
      };
      fetchAdminUsers();
    } else {
      setIsUsersLoading(false);
    }
  }, [user, hasAdminRole, aboutContent.adminUids, toast]);


  const eventsWithSponsorCount = useMemo(() => events.map(event => ({
    ...event,
    sponsorCount: sponsors.filter(s => s.eventsSponsored.some(e => e.eventId === event.id)).length
  })), [events, sponsors]);

  const filteredEvents = useMemo(() => {
    return eventsWithSponsorCount
      .filter(event => countryFilter === ALL_COUNTRIES_VALUE || event.location.country === countryFilter)
      .filter(event => {
        if (sponsorCountFilter === 'all') return true;
        if (sponsorCountFilter === 'none') return event.sponsorCount === 0;
        if (sponsorCountFilter === 'sponsored') return event.sponsorCount > 0;
        return true;
      });
  }, [eventsWithSponsorCount, countryFilter, sponsorCountFilter]);

  const filteredCommunities = useMemo(() => communities.filter(c => countryFilter === ALL_COUNTRIES_VALUE || c.country === countryFilter), [communities, countryFilter]);
  const filteredBusinesses = useMemo(() => businesses.filter(b => countryFilter === ALL_COUNTRIES_VALUE || b.location.country === countryFilter), [businesses, countryFilter]);
  const pendingReports = useMemo(() => reports.filter(r => r.status === 'pending'), [reports]);

  useEffect(() => {
    if (aboutContent) {
      setStory(aboutContent.story);
      setLogoUrl(aboutContent.logoUrl || '');
      setFaviconUrl(aboutContent.faviconUrl || '');
    }
  }, [aboutContent]);

  const handleEventStatusChange = useCallback(async (eventId: string, newStatus: Event['status']) => {
    try {
      await updateEventStatus(eventId, newStatus);
      toast({
        title: `Event ${newStatus}`,
        description: `The event has been successfully updated.`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update event status.", variant: "destructive" });
    }
  }, [updateEventStatus, toast]);

  const handleCommunityVerify = useCallback(async (communityId: string) => {
    try {
      await verifyCommunity(communityId);
      toast({
        title: "Community Verified",
        description: "The community has been marked as verified.",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to verify community.", variant: "destructive" });
    }
  }, [verifyCommunity, toast]);

  const handleBusinessVerify = useCallback(async (businessId: string) => {
    try {
      await verifyBusiness(businessId);
      toast({
        title: "Business Verified",
        description: "The business has been marked as verified.",
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to verify business.", variant: "destructive" });
    }
  }, [verifyBusiness, toast]);

  const handleAboutContentSave = useCallback(async (data: Partial<AboutContent>) => {
    try {
      await updateAboutContent(data);
      toast({ title: 'About Page Updated', description: 'Your changes have been saved.' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update about content.", variant: "destructive" });
    }
  }, [updateAboutContent, toast]);

  const handleAddTeamMember = useCallback(async (data: Omit<TeamMember, 'id' | 'avatarUrl'>) => {
    try {
      await addTeamMember(data);
      toast({ title: 'Team Member Added', description: `${data.name} has been added to the team.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add team member.", variant: "destructive" });
    }
  }, [addTeamMember, toast]);

  const handleUpdateTeamMember = useCallback(async (id: string, data: Omit<TeamMember, 'id' | 'avatarUrl'>) => {
    try {
      await updateTeamMember(id, data);
      toast({ title: 'Team Member Updated', description: `${data.name}'s information has been updated.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update team member.", variant: "destructive" });
    }
  }, [updateTeamMember, toast]);

  const handleDeleteTeamMember = useCallback(async (id: string) => {
    try {
      await deleteTeamMember(id);
      toast({ title: 'Team Member Removed', description: 'The team member has been removed.' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove team member.", variant: "destructive" });
    }
  }, [deleteTeamMember, toast]);

  const handleAddAdmin = useCallback(async (email: string) => {
    try {
      await addAdmin(email);
      toast({ title: 'Admin Added', description: `${email} has been granted admin privileges.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add admin. Please check the email.", variant: "destructive" });
      throw error;
    }
  }, [addAdmin, toast]);

  const handleRemoveAdmin = useCallback(async (uid: string) => {
    if (user?.uid === uid) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot remove your own admin privileges.",
        variant: "destructive",
      });
      return;
    }
    try {
      await removeAdmin(uid);
      toast({ title: 'Admin Removed', description: 'Admin privileges have been revoked.' });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove admin.", variant: "destructive" });
    }
  }, [removeAdmin, user, toast]);

  const handleChecklistToggle = useCallback((id: string) => {
    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const getEventStatusVariant = (status: Event['status']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Archived': return 'destructive';
      default: return 'outline';
    }
  };

  const totalLoading = isAuthLoading || isAboutLoading || isReportsLoading || isUsersLoading;

  if (totalLoading || !user || !hasAdminRole) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const contentTabs = [
    { value: "events", label: "Events", count: filteredEvents.length, icon: Calendar },
    { value: "communities", label: "Communities", count: filteredCommunities.length, icon: Users },
    { value: "businesses", label: "Businesses", count: filteredBusinesses.length, icon: Briefcase },
    { value: "movies", label: "Movies", count: movies.length, icon: Film },
    { value: "deals", label: "Deals", count: deals.length, icon: Tag },
    { value: "careers", label: "Careers", count: jobs.length, icon: Briefcase },
  ];

  const mainTabs = [
    { value: "content", label: "Content", icon: FileText },
    { value: "reports", label: "Reports", count: pendingReports.length, icon: AlertTriangle },
    { value: "users", label: "Users", icon: Users },
    { value: "settings", label: "Site", icon: Settings },
    { value: "checklist", label: "Launch", icon: ClipboardCheck },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-6">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
          <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
          <CardDescription>Welcome, {user.name}. Manage all content and settings.</CardDescription>
        </div>
      </div>
      <Tabs defaultValue="content" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex w-max min-w-full">
            {mainTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                <tab.icon className="mr-2 h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count ? ` (${tab.count})` : ''}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Review and manage all user-submitted content.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="events" className="w-full">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 border-b">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <TabsList className="inline-flex w-max min-w-full">
                      {contentTabs.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                          <tab.icon className="mr-2 h-4 w-4" />
                          {tab.label} ({tab.count})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </ScrollArea>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <CountrySelector value={countryFilter} onValueChange={setCountryFilter} />
                    <Select value={sponsorCountFilter} onValueChange={setSponsorCountFilter}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by sponsors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sponsorships</SelectItem>
                        <SelectItem value="sponsored">Has Sponsors</SelectItem>
                        <SelectItem value="none">No Sponsors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TabsContent value="events" className="mt-6">
                  <ScrollArea className="w-full h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Organizer</TableHead>
                          <TableHead>Sponsors</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEvents.map(event => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">
                              <Link href={`/events/${event.id}`} className="hover:underline" target="_blank">{event.title}</Link>
                            </TableCell>
                            <TableCell>{event.organizerName}</TableCell>
                            <TableCell>{event.sponsorCount}</TableCell>
                            <TableCell>{format(new Date(event.startDateTime), 'PPp')}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant={getEventStatusVariant(event.status)}>{event.status}</Badge>
                                {event.isFeatured && <Badge><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <TooltipProvider>
                                {event.status === 'Approved' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" onClick={() => updateEventFeaturedStatus(event.id, !event.isFeatured)}>
                                        <Star className="mr-2 h-4 w-4" /> {event.isFeatured ? 'Un-Feature' : 'Feature'}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{event.isFeatured ? 'Remove featured status' : 'Mark as featured'}</TooltipContent>
                                  </Tooltip>
                                )}
                                {event.status !== 'Approved' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" onClick={() => handleEventStatusChange(event.id, 'Approved')}>
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Approve this event</TooltipContent>
                                  </Tooltip>
                                )}
                                {event.status !== 'Archived' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="destructive" onClick={() => handleEventStatusChange(event.id, 'Archived')}>
                                        <Archive className="mr-2 h-4 w-4" /> Archive
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Archive this event</TooltipContent>
                                  </Tooltip>
                                )}
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredEvents.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>No events match the current filters.</p></div>}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="communities" className="mt-6">
                  <ScrollArea className="w-full h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Region</TableHead>
                          <TableHead>Founder Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCommunities.map(community => (
                          <TableRow key={community.id}>
                            <TableCell className="font-medium"><Link href={`/c/${community.slug}`} className="hover:underline" target="_blank">{community.name}</Link></TableCell>
                            <TableCell>{community.region}</TableCell>
                            <TableCell>{community.founderEmail}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant={community.isVerified ? 'default' : 'secondary'}>{community.isVerified ? 'Verified' : 'Unverified'}</Badge>
                                {community.isFeatured && <Badge><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <TooltipProvider>
                                {community.isVerified && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" onClick={() => updateCommunityFeaturedStatus(community.id, !community.isFeatured)}>
                                        <Star className="mr-2 h-4 w-4" /> {community.isFeatured ? 'Un-Feature' : 'Feature'}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{community.isFeatured ? 'Remove featured status' : 'Mark as featured'}</TooltipContent>
                                  </Tooltip>
                                )}
                                {!community.isVerified && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" onClick={() => handleCommunityVerify(community.id)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4"/>Verify
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Verify this community</TooltipContent>
                                  </Tooltip>
                                )}
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredCommunities.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>No communities match the current filters.</p></div>}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="businesses" className="mt-6">
                  <ScrollArea className="w-full h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBusinesses.map(business => (
                          <TableRow key={business.id}>
                            <TableCell className="font-medium"><Link href={`/businesses/${business.id}`} className="hover:underline" target="_blank">{business.name}</Link></TableCell>
                            <TableCell>{business.category}</TableCell>
                            <TableCell>{business.location.city}, {business.location.country}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant={business.isVerified ? 'default' : 'secondary'}>{business.isVerified ? 'Verified' : 'Unverified'}</Badge>
                                {business.isFeatured && <Badge><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <TooltipProvider>
                                {business.isVerified && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline" onClick={() => updateBusinessFeaturedStatus(business.id, !business.isFeatured)}>
                                        <Star className="mr-2 h-4 w-4" /> {business.isFeatured ? 'Un-Feature' : 'Feature'}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{business.isFeatured ? 'Remove featured status' : 'Mark as featured'}</TooltipContent>
                                  </Tooltip>
                                )}
                                {!business.isVerified && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" onClick={() => handleBusinessVerify(business.id)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4"/>Verify
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Verify this business</TooltipContent>
                                  </Tooltip>
                                )}
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredBusinesses.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>No businesses match the current filters.</p></div>}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="movies" className="mt-6">
                  <ScrollArea className="w-full h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Genre</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Distributor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movies.map(movie => (
                          <TableRow key={movie.id}>
                            <TableCell><Link href={`/movies/${movie.id}`} className="hover:underline" target="_blank">{movie.title}</Link></TableCell>
                            <TableCell>{movie.genre}</TableCell>
                            <TableCell>{movie.rating}/5</TableCell>
                            <TableCell>{movie.details.distributor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {movies.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>No movies have been added yet.</p></div>}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="deals" className="mt-6">
                  <ScrollArea className="w-full h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Business</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Expires</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deals.map(deal => (
                          <TableRow key={deal.id}>
                            <TableCell><Link href={`/deals/${deal.id}`} className="hover:underline" target="_blank">{deal.title}</Link></TableCell>
                            <TableCell>{deal.business}</TableCell>
                            <TableCell>{deal.category}</TableCell>
                            <TableCell>{format(new Date(deal.expires), 'PP')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {deals.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>No deals have been added yet.</p></div>}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="careers" className="mt-6">
                  <ScrollArea className="w-full h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map(job => (
                          <TableRow key={job.id}>
                            <TableCell><a href={job.applicationUrl} className="hover:underline" target="_blank">{job.title}</a></TableCell>
                            <TableCell>{job.companyName}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{job.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {jobs.length === 0 && <div className="text-center py-12 text-muted-foreground"><p>No jobs have been posted yet.</p></div>}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Review content that has been flagged by the community.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full h-[60vh]">
                {isReportsLoading ? (
                  <div className="text-center py-12 text-muted-foreground flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2"/> Loading reports...
                  </div>
                ) : pendingReports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground"><p>No pending reports. Great job!</p></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Reported</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReports.map(report => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <Link href={report.contentLink} className="font-medium hover:underline" target="_blank">{report.contentTitle}</Link>
                            <p className="text-xs text-muted-foreground">{report.contentType}</p>
                          </TableCell>
                          <TableCell className="max-w-sm whitespace-pre-wrap">{report.reason}</TableCell>
                          <TableCell>
                            {isValid(report.createdAt?.toDate()) ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => updateReportStatus(report.id, 'dismissed')}>
                                    Dismiss
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Dismiss this report</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" onClick={() => updateReportStatus(report.id, 'resolved')}>
                                    Resolve
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Mark as resolved</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Platform Administrators</CardTitle>
                  <CardDescription>Manage users who have admin privileges.</CardDescription>
                </div>
                <AddAdminDialog onSave={handleAddAdmin} />
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full h-[60vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map(admin => (
                        <TableRow key={admin.uid}>
                          <TableCell><Avatar><AvatarImage src={admin.profileImageUrl} /><AvatarFallback>{getInitials(admin.name)}</AvatarFallback></Avatar></TableCell>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="icon" disabled={admin.uid === user.uid}>
                                        <UserX className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will revoke admin privileges for {admin.name}. They will still be a regular user.</AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRemoveAdmin(admin.uid)}>Yes, revoke</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TooltipTrigger>
                                <TooltipContent>Remove admin privileges</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Meet the Team</CardTitle>
                  <CardDescription>Manage team members on the "About Us" page.</CardDescription>
                </div>
                <TeamMemberDialog onSave={handleAddTeamMember}>
                  <Button><UserPlus className="mr-2 h-4 w-4" /> Add Member</Button>
                </TeamMemberDialog>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full h-[60vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aboutContent.teamMembers.map(member => (
                        <TableRow key={member.id}>
                          <TableCell><Avatar><AvatarImage src={member.avatarUrl} /><AvatarFallback>{getInitials(member.name)}</AvatarFallback></Avatar></TableCell>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <TeamMemberDialog member={member} onSave={(data) => handleUpdateTeamMember(member.id, data)}>
                                    <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                                  </TeamMemberDialog>
                                </TooltipTrigger>
                                <TooltipContent>Edit team member</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will permanently delete {member.name} from the team. This action cannot be undone.</AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteTeamMember(member.id)}>Yes, delete</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TooltipTrigger>
                                <TooltipContent>Delete team member</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Site Branding</CardTitle>
                <CardDescription>Manage your site's logo and favicon.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Site Logo (1:1 Ratio)</Label>
                  <ImageUpload value={logoUrl} onChange={(url) => setLogoUrl(url || '')} aspectRatio={1/1} folderName="branding" toast={toast} />
                </div>
                 <div className="space-y-2">
                  <Label>Site Favicon (1:1 Ratio)</Label>
                  <ImageUpload value={faviconUrl} onChange={(url) => setFaviconUrl(url || '')} aspectRatio={1/1} folderName="branding" toast={toast} />
                </div>
                 <Button onClick={() => handleAboutContentSave({ logoUrl, faviconUrl })}>Save Branding</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Our Story</CardTitle>
                <CardDescription>Edit the story on the "About Us" page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={story} onChange={(e) => setStory(e.target.value)} rows={10} className="whitespace-pre-line" placeholder="Enter the About Us story" />
                <Button onClick={() => handleAboutContentSave({ story })}>Save Story</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Application Launch Checklist</CardTitle>
              <CardDescription>A final, comprehensive checklist to ensure all features are implemented correctly before going live.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6']} className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-semibold">Pre-Launch Readiness</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {checklistData.readiness.map(item => (
                      <ChecklistItem key={item.id} {...item} checked={!!checklistState[item.id]} onToggle={handleChecklistToggle} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-xl font-semibold">Core Functionality</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {checklistData.functionality.map(item => (
                      <ChecklistItem key={item.id} {...item} checked={!!checklistState[item.id]} onToggle={handleChecklistToggle} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-xl font-semibold">User Experience & UI</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {checklistData.ui.map(item => (
                      <ChecklistItem key={item.id} {...item} checked={!!checklistState[item.id]} onToggle={handleChecklistToggle} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-xl font-semibold">Content & Data</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {checklistData.content.map(item => (
                      <ChecklistItem key={item.id} {...item} checked={!!checklistState[item.id]} onToggle={handleChecklistToggle} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-xl font-semibold">Admin & Moderation</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {checklistData.admin.map(item => (
                      <ChecklistItem key={item.id} {...item} checked={!!checklistState[item.id]} onToggle={handleChecklistToggle} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-xl font-semibold">Technical & Performance</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {checklistData.technical.map(item => (
                      <ChecklistItem key={item.id} {...item} checked={!!checklistState[item.id]} onToggle={handleChecklistToggle} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
