
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useBusinesses, type Business } from '@/hooks/use-businesses';
import BusinessForm from '@/components/forms/business-form';

export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { toast } = useToast();
  const { user } = useAuth();
  const { businesses, updateBusiness, isLoading } = useBusinesses();
  
  const [isPending, startTransition] = useTransition();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const foundBusiness = businesses.find(b => b.id === id);
    if(foundBusiness) {
      setBusiness(foundBusiness);
    }
  }, [id, businesses]);
  
  const canEdit = user && business && (user.roles.includes('admin') || user.uid === business.ownerId);

  const onSubmit = async (values: any) => {
    if (!business) return;

    startTransition(async () => {
        try {
          await updateBusiness(id, values);
          toast({
              title: 'Business Updated!',
              description: `Details for ${values.name} have been updated.`,
          });
          router.push(`/businesses/${id}`);
        } catch (error) {
          console.error(error);
          toast({
            title: 'Update Failed',
            description: 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
          });
        }
    });
  };

  if (isLoading) {
    return <div className="container mx-auto flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }
  
  if (!business) {
     return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Not Found</CardTitle>
                <CardDescription>The business listing you are looking for does not exist.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2"><Link href="/businesses">Back to Businesses</Link></Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!canEdit) {
     return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You do not have permission to edit this listing.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2"><Link href="/businesses">Back to Businesses</Link></Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Edit Business Listing</CardTitle>
          <CardDescription>
            Update the details for your business listing below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessForm
            business={business}
            isPending={isPending}
            onSubmit={onSubmit}
            onCancel={() => router.back()}
            submitButtonText="Save Changes"
            submitButtonLoadingText="Saving..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
