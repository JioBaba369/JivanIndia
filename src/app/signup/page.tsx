
'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import { Skeleton } from "../ui/skeleton";

const CountrySelector = dynamic(() => import('@/components/layout/country-selector'), {
  loading: () => <Skeleton className="h-10 w-full" />,
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
  country: z.string().min(1, "Country is required."),
  state: z.string().min(2, "State/Province is required."),
  city: z.string().min(2, "City is required."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});


export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      state: '',
      city: '',
    },
    mode: 'onChange'
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setError(null);

    startTransition(async () => {
      try {
        await signup(values.name, values.email, values.password, values.country, values.state, values.city);
        toast({
          title: "Account Created!",
          description: "Welcome! You have been successfully signed up.",
        });
        router.push('/dashboard');
      } catch (err: any) {
        const errorCode = err.code || 'auth/unknown-error';
        switch (errorCode) {
          case 'auth/email-already-in-use':
            setError('This email address is already in use by another account.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            setError('The password is too weak. Please choose a stronger password (at least 6 characters).');
            break;
          default:
            setError('An unexpected error occurred. Please try again later.');
            console.error(err);
            break;
        }
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Create an account to join the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4">
                <FormField name="name" control={form.control} render={({field}) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="Max" disabled={isPending} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="email" control={form.control} render={({field}) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" placeholder="m@example.com" disabled={isPending} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="country" control={form.control} render={({field}) => (<FormItem><FormLabel>Country</FormLabel><FormControl><CountrySelector value={field.value} onValueChange={field.onChange} /></FormControl><FormMessage/></FormItem>)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="state" control={form.control} render={({field}) => (<FormItem><FormLabel>State/Province</FormLabel><FormControl><Input {...field} disabled={isPending} /></FormControl><FormMessage/></FormItem>)} />
                  <FormField name="city" control={form.control} render={({field}) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} disabled={isPending} /></FormControl><FormMessage/></FormItem>)} />
                </div>
                <FormField name="password" control={form.control} render={({field}) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input {...field} type="password" disabled={isPending} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="confirmPassword" control={form.control} render={({field}) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input {...field} type="password" disabled={isPending} /></FormControl><FormMessage/></FormItem>)} />
              </div>
            </CardContent>
            <CardFooter className="flex-col">
              <Button type="submit" className="w-full" disabled={isPending || !form.formState.isValid}>
                {isPending && <Loader2 className="mr-2 animate-spin" />}
                Create Account
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

    