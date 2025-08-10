
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, UserPlus, Shield, Users, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCommunities, type Community, type CommunityManager } from '@/hooks/use-communities';
import { useAuth, type User } from '@/hooks/use-auth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmailInput } from "@/components/feature/user-search";
import { Skeleton } from "@/components/ui/skeleton";

type ManagerRole = 'admin' | 'moderator';

export default function CommunityManagersPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const { getCommunityBySlug, isLoading: isLoadingCommunities, addManager, removeManager, canManageCommunity } = useCommunities();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isPending, startTransition] = useTransition();
  const [community, setCommunity] = useState<Community | null>(null);
  
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newManagerRole, setNewManagerRole] = useState<ManagerRole>('moderator');
  const [foundUser, setFoundUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoadingCommunities) {
      const foundCommunity = getCommunityBySlug(slug);
      setCommunity(foundCommunity || null);
    }
  }, [slug, getCommunityBySlug, isLoadingCommunities]);

  const canManage = user && community && canManageCommunity(community, user);

  if (isLoadingCommunities) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!community || !user || !canManage) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <CardTitle className="font-headline text-2xl mt-4">Access Denied</CardTitle>
            <CardDescription>You do not have permission to manage this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/c/${slug}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Community
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddManager = async () => {
    if (community && foundUser) {
      startTransition(async () => {
        try {
          await addManager(community, foundUser.email, newManagerRole);
          toast({ title: 'Manager Added', description: `${foundUser.name} can now manage this community.` });
          setNewManagerEmail('');
          setFoundUser(null);
        } catch(error: any) {
           toast({ title: 'Error Adding Manager', description: error.message, variant: 'destructive' });
        }
      });
    }
  };

  const handleRemoveManager = async (uid: string) => {
    if (community) {
      startTransition(async () => {
        try {
          await removeManager(community, uid);
          toast({ title: 'Manager Removed', description: `Manager has been removed successfully.` });
        } catch(error: any) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
      });
    }
  };
  
  const ManagerCard = ({ manager, isFounder }: { manager: { uid: string, name: string, email: string, role?: ManagerRole }, isFounder: boolean }) => (
     <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
        <div className="flex items-center gap-4">
        {/* Placeholder Avatar - in real app, fetch manager's avatar */}
        <Avatar><AvatarFallback>{getInitials(manager.name)}</AvatarFallback></Avatar>
        <div>
            <p className="font-semibold">{manager.name}</p>
            <p className="text-sm text-muted-foreground">{manager.email}</p>
        </div>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="secondary">
                {isFounder ? <><Shield className="mr-1 h-3 w-3"/>Founder</> : manager.role}
            </Badge>
            {!isFounder && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isPending}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Remove {manager.name}?</AlertDialogTitle><AlertDialogDescription>This will revoke all management permissions for this user.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleRemoveManager(manager.uid)}>Yes, remove</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    </div>
  );
  
  const managersWithDetails = community.managerUids.map(uid => {
      // In a real app you'd fetch user details here. For now, we mock it.
      return { uid, name: 'Manager User', email: 'loading...' , role: 'moderator' as ManagerRole}
  });


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
            <Button variant="ghost" size="sm" asChild>
                <Link href={`/c/${slug}/edit`}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Edit Community
                </Link>
            </Button>
            <h1 className="font-headline text-3xl font-bold">Manage Community Managers</h1>
            <p className="text-muted-foreground">Add or remove users who can manage "{community.name}".</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/>Current Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ManagerCard manager={{uid: user.uid, name: user.name, email: user.email}} isFounder={true} />
              
              {/* Display other managers */}
              {community.managerUids?.filter(uid => uid !== user.uid).map(managerUid => (
                  <ManagerCard key={managerUid} manager={{uid: managerUid, name: 'Manager User', email: 'email@example.com', role: 'moderator'}} isFounder={false} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5"/>Add New Manager</CardTitle>
            <CardDescription>Enter the email of a registered user to grant them management permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-2">
              <EmailInput
                value={newManagerEmail}
                onChange={setNewManagerEmail}
                onUserFound={setFoundUser}
                placeholder="Enter user's email address"
              />
              <Select value={newManagerRole} onValueChange={(value) => setNewManagerRole(value as ManagerRole)}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddManager} disabled={!foundUser || isPending} className="mt-2 md:mt-0">
                {isPending ? <Loader2 className="mr-2 animate-spin"/> : <UserPlus className="mr-2"/>} Add Manager
              </Button>
            </div>
            {!foundUser && newManagerEmail.length > 5 && (
              <p className="text-sm text-destructive mt-2">No user found with this email.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
