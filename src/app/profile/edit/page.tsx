
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ImageCropper from '@/components/feature/image-cropper';

export default function EditProfilePage() {
  const { toast } = useToast();
  const { user, updateUser, getInitials } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  
  const [currentCountry, setCurrentCountry] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [currentCity, setCurrentCity] = useState('');

  const [originState, setOriginState] = useState('');
  const [originDistrict, setOriginDistrict] = useState('');

  const [languages, setLanguages] = useState('');
  const [interests, setInterests] = useState('');
  const [website, setWebsite] = useState('');
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setPhone(user.phone || '');
      setWebsite(user.website || '');
      setCurrentCountry(user.currentLocation?.country || '');
      setCurrentState(user.currentLocation?.state || '');
      setCurrentCity(user.currentLocation?.city || '');
      setOriginState(user.originLocation?.indiaState || '');
      setOriginDistrict(user.originLocation?.indiaDistrict || '');
      setLanguages(user.languagesSpoken?.join(', ') || '');
      setInterests(user.interests?.join(', ') || '');
      setProfileImageUrl(user.profileImageUrl || '');
    } else if (!user) {
        router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const languagesSpoken = languages.split(',').map(s => s.trim()).filter(Boolean);
        const userInterests = interests.split(',').map(s => s.trim()).filter(Boolean);

        updateUser({ 
            name, 
            username,
            email, 
            bio, 
            profileImageUrl: profileImageUrl, 
            phone,
            website,
            currentLocation: {
                country: currentCountry,
                state: currentState,
                city: currentCity
            },
            originLocation: {
                indiaState: originState,
                indiaDistrict: originDistrict,
            },
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
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  }

  const handleCropSave = (croppedDataUrl: string) => {
    setProfileImageUrl(croppedDataUrl);
    setIsCropperOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
        {imageSrc && (
          <ImageCropper
            isOpen={isCropperOpen}
            onClose={() => setIsCropperOpen(false)}
            imageSrc={imageSrc}
            onSave={handleCropSave}
            aspectRatio={1} 
          />
        )}
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
                    <Avatar className="relative h-24 w-24 border-4 border-primary">
                        {profileImageUrl ? (
                            <Image
                                src={profileImageUrl}
                                alt="Profile preview"
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <AvatarFallback className="font-headline text-3xl">{getInitials(name)}</AvatarFallback>
                        )}
                    </Avatar>
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
                        <Label htmlFor="username">Username</Label>
                        <Input 
                            id="username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
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
                    <div className="grid gap-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input 
                            id="website" 
                            type="url"
                            placeholder="e.g., your-portfolio.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                        id="phone" 
                        type="tel"
                        placeholder="e.g., +1 123 456 7890"
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

                <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold border-b pb-2">Current Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="current-country">Country</Label>
                            <Input id="current-country" placeholder="e.g., USA" value={currentCountry} onChange={(e) => setCurrentCountry(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="current-state">State / Province</Label>
                            <Input id="current-state" placeholder="e.g., California" value={currentState} onChange={(e) => setCurrentState(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="current-city">City</Label>
                            <Input id="current-city" placeholder="e.g., San Francisco" value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold border-b pb-2">Origin in India (Optional)</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="origin-state">State</Label>
                            <Input id="origin-state" placeholder="e.g., Kerala, Punjab" value={originState} onChange={(e) => setOriginState(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="origin-district">District</Label>
                            <Input id="origin-district" placeholder="e.g., Kollam, Ludhiana" value={originDistrict} onChange={(e) => setOriginDistrict(e.target.value)} />
                        </div>
                    </div>
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
