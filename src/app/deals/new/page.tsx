
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, FormEvent } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { ImageUp, Loader2 } from 'lucide-react';
import ImageCropper from '@/components/feature/image-cropper';

export default function NewDealPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [businessName, setBusinessName] = useState(user?.affiliation?.orgName || '');
  const [expires, setExpires] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleCropSave = (croppedDataUrl: string) => {
    setCroppedImage(croppedDataUrl);
    setIsCropperOpen(false);
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
     if (!user?.affiliation) {
      toast({
        title: 'Affiliation Required',
        description: 'You must be affiliated with a registered business to post a deal.',
        variant: 'destructive',
      });
      return;
    }
    if (!croppedImage) {
      toast({
        title: 'Image Required',
        description: 'Please upload and crop an image for the deal banner.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would save to a database.
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log({
        title, description, terms, category, businessName, expires, imageUrl: croppedImage
    });

    toast({
      title: 'Deal Submitted!',
      description: `Your deal "${title}" has been submitted for review.`,
    });
    
    setIsSubmitting(false);
    router.push('/deals');
  };

   if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to post a deal. Please log in to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/login">Login</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user.affiliation) {
     return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Business Affiliation Required</CardTitle>
                <CardDescription>You must represent a registered business to post a deal.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="mt-2">
                    <Link href="/communities/new">Register Your Business</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
        {imageSrc && (
            <ImageCropper
            isOpen={isCropperOpen}
            onClose={() => setIsCropperOpen(false)}
            imageSrc={imageSrc}
            onSave={handleCropSave}
            aspectRatio={16 / 9}
            />
        )}
      <Card className="mx-auto max-w-3xl shadow-xl shadow-black/5">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Deal</CardTitle>
          <CardDescription>
            Fill out the form below to post a deal for the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
             <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Deal Media</h3>
                <div className="space-y-2">
                    <Label htmlFor="deal-image">Deal Image</Label>
                    <Card 
                      className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-muted hover:bg-muted/80"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {croppedImage ? (
                        <Image src={croppedImage} alt="Deal image preview" fill className="object-cover rounded-lg"/>
                      ) : (
                        <>
                          <ImageUp className="h-8 w-8 text-muted-foreground" />
                          <span className="text-muted-foreground">Click to upload image (16:9 ratio recommended)</span>
                        </>
                      )}
                    </Card>
                     <Input 
                      id="deal-image" 
                      type="file" 
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg"
                    />
                </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold border-b pb-2">Deal Information</h3>
              <div className="space-y-2">
                <Label htmlFor="title">Deal Title</Label>
                <Input id="title" placeholder="e.g., 20% Off Lunch Special" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" value={businessName} readOnly disabled />
                <p className="text-xs text-muted-foreground">This is based on your community affiliation.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                        <SelectItem value="Retail & Shopping">Retail & Shopping</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="expires">Expiration Date</Label>
                    <Input id="expires" type="date" value={expires} onChange={(e) => setExpires(e.target.value)} required/>
                 </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the deal in a few sentences." value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea id="terms" placeholder="Enter any terms, conditions, or restrictions for this deal." value={terms} onChange={(e) => setTerms(e.target.value)} required rows={3}/>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 animate-spin"/>Creating...</> : "Create Deal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
