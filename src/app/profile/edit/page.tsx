
'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Paperclip } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [indianAddress, setIndianAddress] = useState('');
  const [languages, setLanguages] = useState('');
  const [interests, setInterests] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setPhone(user.phone || '');
      setHomeAddress(user.homeAddress || '');
      setIndianAddress(user.indianAddress || '');
      setLanguages(user.languagesSpoken?.join(', ') || '');
      setInterests(user.interests?.join(', ') || '');
      setProfileImageUrl(user.profileImageUrl || user.affiliation?.orgLogoUrl || "https://placehold.co/100x100.png");
    } else {
        router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        let newImageUrl = profileImageUrl;
        if (profileImage) {
            newImageUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(profileImage);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const languagesSpoken = languages.split(',').map(s => s.trim()).filter(Boolean);
        const userInterests = interests.split(',').map(s => s.trim()).filter(Boolean);

        updateUser({ 
            name, 
            email, 
            bio, 
            profileImageUrl: newImageUrl, 
            phone, 
            homeAddress, 
            indianAddress,
            languagesSpoken,
            interests: userInterests
        });
        
        toast({
            title: "Profile Updated!",
            description: "Your profile information has been successfully updated.",
        });

        router.push('/profile');

    } catch (error) {
        console.error("Update failed", error);
        toast({
            title: "Update Failed",
            description: "There was an error updating your profile. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setProfileImage(file);
        setProfileImageUrl(URL.createObjectURL(file));
    }
  }

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Update Your Profile</CardTitle>
                <CardDescription>
                    Feel free to make any changes you need. Just hit "Save" when you're finished.
                </CardDescription>
            </CardHeader>
            <CardContent>
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                    {profileImageUrl && <Image
                        src={profileImageUrl}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="rounded-full object-cover border-4 border-primary"
                    />}
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="mr-2 h-4 w-4" />
                        Change Profile Picture
                    </Button>
                    <Input 
                        id="profile-picture" 
                        type="file" 
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                        id="phone" 
                        type="tel"
                        placeholder="e.g., (123) 456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="bio">A Little About You</Label>
                    <Textarea
                        id="bio"
                        placeholder="This is a good place to put your bio..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="languages">Languages Spoken</Label>
                        <Input 
                            id="languages" 
                            placeholder="e.g., Hindi, English, Gujarati"
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Separate languages with a comma.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interests">Interests</Label>
                        <Input 
                            id="interests" 
                            placeholder="e.g., Volunteering, Music, Sports"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Separate interests with a comma.</p>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="homeAddress">Home Address</Label>
                    <Textarea
                        id="homeAddress"
                        placeholder="Your address in your current country of residence."
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="indianAddress">Indian Address (Optional)</Label>
                    <Textarea
                        id="indianAddress"
                        placeholder="Your address in India, if applicable."
                        value={indianAddress}
                        onChange={(e) => setIndianAddress(e.target.value)}
                        rows={3}
                    />
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/profile">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save"}
                    </Button>
                </div>
            </form>
            </CardContent>
        </Card>
    </div>
  );
}
