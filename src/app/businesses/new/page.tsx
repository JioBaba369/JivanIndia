
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
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useBusinesses, type NewBusinessInput } from '@/hooks/use-businesses';
import BusinessForm from '@/components/forms/business-form';

export default function NewBusinessEntryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addBusiness } = useBusinesses();
  
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: any) => {
    if (!user) {
        toast({
            title: 'Authentication Required',
            description: 'You must be logged in to create a business listing.',
            variant: 'destructive',
        });
        return;
    }

    startTransition(async () => {
        const newBusinessData: NewBusinessInput = {
          ...values,
          ownerId: user.uid,
        };
        
        try {
          await addBusiness(newBusinessData);
          toast({
              title: 'Business Submitted!',
              description: `${values.name} has been submitted for review. It will be visible after approval.`,
          });
          router.push('/businesses');
        } catch (error) {
          console.error(error);
          toast({
            title: 'Submission Failed',
            description: 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
          });
        }
    });
  };

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to add a business listing.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2"><Link href="/login">Login</Link></Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Business Listing</CardTitle>
          <CardDescription>
            Add a business to the directory. Your submission will be reviewed by an administrator before it is published.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <BusinessForm
                isPending={isPending}
                onSubmit={onSubmit}
                onCancel={() => router.back()}
                submitButtonText="Submit for Review"
                submitButtonLoadingText="Submitting..."
            />
        </CardContent>
      </Card>
    </div>
  );
}
