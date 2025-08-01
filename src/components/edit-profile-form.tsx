
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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setProfileImageUrl(user.profileImageUrl || user.affiliation?.orgLogoUrl || "https://placehold.co/100x100.png");
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        let newImageUrl = user?.profileImageUrl || '';
        if (profileImage) {
            // In a real app, you'd upload this file to a storage service (like Firebase Storage)
            // and get a URL back. For this demo, we'll convert it to a base64 Data URL.
            newImageUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(profileImage);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updateUser({ name, email, bio, profileImageUrl: newImageUrl });

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
        // Create a temporary URL to preview the image
        setProfileImageUrl(URL.createObjectURL(file));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">

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
                    Change Picture
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
                <Label htmlFor="name">Name</Label>
                <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="bio">Your Bio</Label>
                <Textarea
                    id="bio"
                    placeholder="Tell us a little about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save changes"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
