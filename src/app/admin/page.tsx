
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type User } from '@/hooks/use-auth';
import { useEvents, type Event } from '@/hooks/use-events';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, CheckCircle2, Edit, Trash2, UserPlus, Archive, Check, UserX, Loader2, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunities, type Community } from '@/hooks/use-communities';
import { useAbout, type TeamMember } from '@/hooks/use-about';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getInitials } from '@/lib/utils';
import { firestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useBusinesses } from '@/hooks/use-businesses';


const TeamMemberDialog = ({
  member,
  onSave,
  children
}: {
  member?: TeamMember | null,
  onSave: (data: Omit<TeamMember, 'id'>) => void,
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [bio, setBio] = useState(member?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(member?.avatarUrl || '');

  useEffect(() => {
    if (isOpen) {
      setName(member?.name || '');
      setRole(member?.role || '');
      setBio(member?.bio || '');
      setAvatarUrl(member?.avatarUrl || '');
    }
  }, [isOpen, member]);

  const handleSave = () => {
    onSave({ name, role, bio, avatarUrl });
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
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
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
  )
}

const AddAdminDialog = ({ onSave }: { onSave: (email: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleSave = () => {
        onSave(email);
        setIsOpen(false);
        setEmail('');
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add Admin</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Administrator</DialogTitle>
                    <CardDescription>Enter the email address of the user you want to grant admin privileges to.</CardDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label htmlFor="email">User Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave}>Grant Access</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { events, updateEventStatus, updateEventFeaturedStatus } = useEvents();
  const { communities, verifyCommunity, updateCommunityFeaturedStatus } = useCommunities();
  const { aboutContent, updateStory, addTeamMember, updateTeamMember, deleteTeamMember, addAdmin, removeAdmin, isLoading: isAboutLoading } = useAbout();
  const { businesses, verifyBusiness, updateBusinessFeaturedStatus } = useBusinesses();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [story, setStory] = useState('');

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsUsersLoading(true);
      try {
        const usersCollectionRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        setUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User)));
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast({ title: 'Error', description: 'Could not fetch user list.', variant: 'destructive' });
      } finally {
        setIsUsersLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchAllUsers();
    }
  }, [user?.isAdmin, toast]);

  useEffect(() => {
    if (!isLoading && !user?.isAdmin) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setStory(aboutContent.story);
  }, [aboutContent.story]);

  const handleEventStatusChange = (eventId: string, newStatus: Event['status']) => {
    updateEventStatus(eventId, newStatus);
    toast({
        title: `Event ${newStatus}`,
        description: `The event has been successfully updated.`,
    });
  }

  const handleCommunityVerify = (communityId: string) => {
    verifyCommunity(communityId);
    toast({
        title: "Community Verified",
        description: "The community has been marked as verified.",
    });
  };

  const handleBusinessVerify = (businessId: string) => {
    verifyBusiness(businessId);
    toast({
      title: "Business Verified",
      description: "The business has been marked as verified.",
    });
  };

  const handleStorySave = () => {
    updateStory(story);
    toast({ title: 'About Page Updated', description: '"Our Story" has been saved.' });
  }

  const handleAddTeamMember = (data: Omit<TeamMember, 'id'>) => {
    addTeamMember(data);
    toast({ title: 'Team Member Added', description: `${data.name} has been added to the team.` });
  }

  const handleUpdateTeamMember = (id: string, data: Omit<TeamMember, 'id'>) => {
    updateTeamMember(id, data);
    toast({ title: 'Team Member Updated', description: `${data.name}'s information has been updated.` });
  }
  
  const handleDeleteTeamMember = (id: string) => {
    deleteTeamMember(id);
    toast({ title: 'Team Member Removed', description: 'The team member has been removed.' });
  }

  const handleAddAdmin = async (email: string) => {
    await addAdmin(email, users);
  }

  const handleRemoveAdmin = async (uid: string) => {
    if (user?.uid === uid) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot remove your own admin privileges.",
        variant: "destructive",
      });
      return;
    }
    await removeAdmin(uid);
  }

  const getEventStatusVariant = (status: Event['status']) => {
    switch (status) {
        case 'Approved': return 'default';
        case 'Pending': return 'secondary';
        case 'Archived': return 'destructive';
        default: return 'outline';
    }
  }
  
  const totalLoading = isLoading || isAboutLoading || (user?.isAdmin && isUsersLoading);

  if (totalLoading) {
    return (
        <div className="container mx-auto px-4 py-12 text-center flex items-center justify-center min-h-[calc(100vh-128px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!user?.isAdmin) {
      router.push('/');
      return null;
  }

  const sortedEvents = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sortedCommunities = [...communities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sortedBusinesses = [...businesses].sort((a,b) => a.name.localeCompare(b.name));
  const adminUsers = users.filter(u => aboutContent.adminUids?.includes(u.uid));


  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
          </div>
          <CardDescription>Manage all submitted content on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
                    <TabsTrigger value="events">Events ({sortedEvents.length})</TabsTrigger>
                    <TabsTrigger value="communities">Communities ({sortedCommunities.length})</TabsTrigger>
                    <TabsTrigger value="businesses">Businesses ({sortedBusinesses.length})</TabsTrigger>
                    <TabsTrigger value="about">About Page</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="mt-6">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {sortedEvents.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/events/${event.id}`} className="hover:underline" target="_blank">{event.title}</Link>
                                    </TableCell>
                                    <TableCell>{event.organizerName}</TableCell>
                                    <TableCell>{format(new Date(event.startDateTime), 'PPp')}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                          <Badge variant={getEventStatusVariant(event.status)}>{event.status}</Badge>
                                          {event.isFeatured && <Badge><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {event.status === 'Approved' && (
                                            <Button size="sm" variant="outline" onClick={() => updateEventFeaturedStatus(event.id, !event.isFeatured)}>
                                                <Star className="mr-2 h-4 w-4" /> {event.isFeatured ? 'Un-Feature' : 'Feature'}
                                            </Button>
                                        )}
                                        {event.status !== 'Approved' && (
                                            <Button size="sm" onClick={() => handleEventStatusChange(event.id, 'Approved')}>
                                                <Check className="mr-2 h-4 w-4" /> Approve
                                            </Button>
                                        )}
                                        {event.status !== 'Archived' && (
                                            <Button size="sm" variant="destructive" onClick={() => handleEventStatusChange(event.id, 'Archived')}>
                                                <Archive className="mr-2 h-4 w-4" /> Archive
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                    {sortedEvents.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No events have been submitted yet.</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="communities" className="mt-6">
                    <div className="w-full overflow-x-auto">
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
                                {sortedCommunities.map(community => (
                                    <TableRow key={community.id}>
                                        <TableCell className="font-medium">
                                          <Link href={`/c/${community.slug}`} className="hover:underline" target="_blank">{community.name}</Link>
                                        </TableCell>
                                        <TableCell>{community.region}</TableCell>
                                        <TableCell>{community.founderEmail}</TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Badge variant={community.isVerified ? 'default' : 'secondary'}>
                                                {community.isVerified ? 'Verified' : 'Unverified'}
                                            </Badge>
                                             {community.isFeatured && <Badge><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                                           </div>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {community.isVerified && (
                                              <Button size="sm" variant="outline" onClick={() => updateCommunityFeaturedStatus(community.id, !community.isFeatured)}>
                                                  <Star className="mr-2 h-4 w-4" /> {community.isFeatured ? 'Un-Feature' : 'Feature'}
                                              </Button>
                                            )}
                                            {!community.isVerified && (
                                                <Button size="sm" onClick={() => handleCommunityVerify(community.id)}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4"/>
                                                    Verify
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     {sortedCommunities.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No communities have been created yet.</p>
                        </div>
                    )}
                </TabsContent>
                 <TabsContent value="businesses" className="mt-6">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Region</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedBusinesses.map(business => (
                                    <TableRow key={business.id}>
                                        <TableCell className="font-medium">
                                          <Link href={`/businesses/${business.id}`} className="hover:underline" target="_blank">{business.name}</Link>
                                        </TableCell>
                                        <TableCell>{business.category}</TableCell>
                                        <TableCell>{business.region}</TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Badge variant={business.isVerified ? 'default' : 'secondary'}>
                                                {business.isVerified ? 'Verified' : 'Unverified'}
                                            </Badge>
                                             {business.isFeatured && <Badge><Star className="mr-1 h-3 w-3" />Featured</Badge>}
                                           </div>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {business.isVerified && (
                                              <Button size="sm" variant="outline" onClick={() => updateBusinessFeaturedStatus(business.id, !business.isFeatured)}>
                                                  <Star className="mr-2 h-4 w-4" /> {business.isFeatured ? 'Un-Feature' : 'Feature'}
                                              </Button>
                                            )}
                                            {!business.isVerified && (
                                                <Button size="sm" onClick={() => handleBusinessVerify(business.id)}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4"/>
                                                    Verify
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     {sortedBusinesses.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No businesses have been created yet.</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="about" className="mt-6">
                    <div className="space-y-8">
                        {/* Story Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Our Story</CardTitle>
                                <CardDescription>Edit the story section that appears on the "About Us" page.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea 
                                    value={story}
                                    onChange={(e) => setStory(e.target.value)}
                                    rows={10}
                                    className="whitespace-pre-line"
                                />
                                <Button onClick={handleStorySave}>Save Story</Button>
                            </CardContent>
                        </Card>

                        {/* Team Members Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Meet the Team</CardTitle>
                                        <CardDescription>Manage the team members displayed on the "About Us" page.</CardDescription>
                                    </div>
                                    <TeamMemberDialog onSave={handleAddTeamMember}>
                                        <Button><UserPlus className="mr-2 h-4 w-4" /> Add Member</Button>
                                    </TeamMemberDialog>
                                </div>
                            </CardHeader>
                            <CardContent>
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
                                                <TableCell>
                                                    <Avatar>
                                                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                                                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell>{member.role}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <TeamMemberDialog member={member} onSave={(data) => handleUpdateTeamMember(member.id, data)}>
                                                      <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                                                    </TeamMemberDialog>
                                                    <AlertDialog>
                                                      <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                                      </AlertDialogTrigger>
                                                      <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            This will permanently delete {member.name} from the team. This action cannot be undone.
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                          <AlertDialogAction onClick={() => handleDeleteTeamMember(member.id)}>Yes, delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                      </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                         {/* Admins Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Platform Administrators</CardTitle>
                                        <CardDescription>Manage users who have admin privileges.</CardDescription>
                                    </div>
                                    <AddAdminDialog onSave={handleAddAdmin} />
                                </div>
                            </CardHeader>
                            <CardContent>
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
                                                <TableCell>
                                                    <Avatar>
                                                        <AvatarImage src={admin.profileImageUrl} alt={admin.name} />
                                                        <AvatarFallback>{getInitials(admin.name)}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">{admin.name}</TableCell>
                                                <TableCell>{admin.email}</TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="icon" disabled={admin.uid === user.uid}>
                                                                <UserX className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            This will revoke admin privileges for {admin.name}. They will still be a regular user.
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                          <AlertDialogAction onClick={() => handleRemoveAdmin(admin.uid)}>Yes, revoke</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                      </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
