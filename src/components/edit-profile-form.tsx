
'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Paperclip } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from './ui/textarea';
import Image from 'next/image';

interface EditProfileFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileForm({ isOpen, onOpenChange }: EditProfileFormProps) {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [indianAddress, setIndianAddress] = useState('');
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
      setProfileImageUrl(user.profileImageUrl || user.affiliation?.orgLogoUrl || "https://placehold.co/100x100.png");
    }
  }, [user, isOpen]);

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
        
        updateUser({ name, email, bio, profileImageUrl: newImageUrl, phone, homeAddress, indianAddress });

        onOpenChange(false);
        toast({
            title: "Profile Updated!",
            description: "Your profile information has been successfully updated.",
        });

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Update Your Profile</DialogTitle>
            <DialogDescription>
                Feel free to make any changes you need. Just hit "Save" when you're finished.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-2">

            <div className="flex flex-col items-center gap-4">
                <Image
                    src={profileImageUrl}
                    alt="Profile preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="mr-2" />
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
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="homeAddress">Address</Label>
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

            </div>
            <DialogFooter className='pt-4'>
            <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
