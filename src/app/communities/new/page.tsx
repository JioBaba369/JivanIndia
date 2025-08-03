
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
import { useState, useRef, FormEvent, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { ImageUp } from 'lucide-react';
import ImageCropper from '@/components/feature/image-cropper';
import { useCommunities, type Community, type NewCommunityInput } from '@/hooks/use-communities';

export default function NewCommunityPage() {
  const router = useRouter();
  const { addCommunity, isSlugUnique } = useCommunities();
  const { toast } = useToast();
  const { user, setAffiliation } = useAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugIsDirty, setSlugIsDirty] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [type, setType] = useState<Community['type']>('Other');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [region, setRegion] = useState('');
  const [tags, setTags] = useState('');

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = useCallback((value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }, []);

  useEffect(() => {
    if (!slugIsDirty) {
      setSlug(generateSlug(name));
    }
  }, [name, slugIsDirty, generateSlug]);

  useEffect(() => {
    if (slug) {
      if (!isSlugUnique(slug)) {
        setSlugError('This URL is already taken.');
      } else {
        setSlugError(null);
      }
    }
  }, [slug, isSlugUnique]);


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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({
            title: 'Authentication Error',
            description: 'You must be logged in to create a community.',
            variant: 'destructive',
        });
        return;
    }
     if (!croppedImage) {
      toast({
        title: 'Image Required',
        description: 'Please upload and crop an image for the community banner.',
        variant: 'destructive',
      });
      return;
    }
    if (slugError) {
      toast({
        title: 'Invalid URL',
        description: slugError,
        variant: 'destructive',
      });
      return;
    }

    const newCommunity: NewCommunityInput = {
      name,
      slug,
      type,
      description,
      fullDescription,
      region,
      imageUrl: croppedImage,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      membersCount: 1,
      // These are placeholders, a real app would have more complex logic
      address: `${region}, USA`,
      phone: '(123) 456-7890',
      contactEmail: `contact@${slug}.org`,
      website: `www.${slug}.org`,
      founded: new Date().getFullYear().toString(),
      founderUid: user.uid,
    };

    const addedCommunity = addCommunity(newCommunity, user.email);

    setAffiliation(addedCommunity.id, addedCommunity.name);

    toast({
      title: 'Community Submitted!',
      description: `Your community "${name}" has been submitted for review.`,
    });

    router.push(`/c/${addedCommunity.slug}`);
  };

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Access Denied</CardTitle>
                <CardDescription>You must be logged in to create a community. Please log in to continue.</CardDescription>
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
  
    if (user.affiliation) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Already Affiliated</CardTitle>
            <CardDescription>You are already affiliated with a community and cannot create a new one.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="font-semibold">{user.affiliation.orgName}</p>
            <Button asChild className="mt-4">
                <Link href={`/communities/${user.affiliation.orgId}`}>View Your Community</Link>
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
          <CardTitle className="font-headline text-3xl">Establish Your Community's Presence</CardTitle>
          <CardDescription>
            Fill out the form below to add your organization to the JivanIndia.co community hub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Identity</h3>
                <div className="space-y-2">
                    <Label htmlFor="community-image">Community Banner Image</Label>
                    <Card 
                      className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-muted hover:bg-muted/80"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {croppedImage ? (
                        <Image src={croppedImage} alt="Community banner preview" fill className="object-cover rounded-lg"/>
                      ) : (
                        <>
                          <ImageUp className="h-8 w-8 text-muted-foreground" />
                          <span className="text-muted-foreground">Click to upload image (16:9 ratio recommended)</span>
                        </>
                      )}
                    </Card>
                     <Input 
                      id="community-image" 
                      type="file" 
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg"
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Community Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Bay Area Tamil Sangam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Community URL</Label>
                    <Input
                      id="slug"
                      placeholder="e.g., bay-area-tamil-sangam"
                      value={slug}
                      onChange={(e) => {
                        setSlugIsDirty(true);
                        setSlug(generateSlug(e.target.value));
                      }}
                      required
                    />
                    <p className="text-xs text-muted-foreground">jivanindia.co/c/{slug}</p>
                    {slugError && <p className="text-xs text-destructive">{slugError}</p>}
                  </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold border-b pb-2">Community Details & Purpose</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label htmlFor="type">Community Category</Label>
                        <Select value={type} onValueChange={(value) => setType(value as any)} required>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cultural & Arts">Cultural & Arts</SelectItem>
                                <SelectItem value="Business & Commerce">Business & Commerce</SelectItem>
                                <SelectItem value="Social & Non-Profit">Social & Non-Profit</SelectItem>
                                <SelectItem value="Educational">Educational</SelectItem>
                                <SelectItem value="Religious">Religious</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="region">Region</Label>
                        <Input
                            id="region"
                            placeholder="e.g., San Francisco Bay Area"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description (for listing pages)</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief, one-sentence summary of your community's purpose."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={2}
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="fullDescription">Full Description (for your main profile page)</Label>
                  <Textarea
                    id="fullDescription"
                    placeholder="Provide a detailed description of your community's mission, activities, history, and who it's for."
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    required
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags / Keywords</Label>
                    <Input
                        id="tags"
                        placeholder="e.g., cultural, family-friendly, south-indian, networking"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Separate keywords with a comma to help users discover your community.</p>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={!!slugError}>Create Community</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
