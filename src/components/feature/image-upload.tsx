
'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { UploadCloud, CheckCircle, ImageUp, Loader2 } from 'lucide-react';
import ImageCropper from './image-cropper';
import type { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Progress } from '../ui/progress';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  aspectRatio: number;
  toast: ReturnType<typeof useToast>['toast'];
  iconType?: 'banner' | 'logo';
  folderName: string; // e.g., 'community-logos', 'event-banners'
}

const IMAGE_MAX_SIZE_MB = 5;

export default function ImageUpload({
  value,
  onChange,
  aspectRatio,
  toast,
  iconType = 'logo',
  folderName,
}: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > IMAGE_MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: 'Image Too Large',
          description: `Please select an image smaller than ${IMAGE_MAX_SIZE_MB}MB.`,
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsCropperOpen(true);
        if (e.target) e.target.value = '';
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (blob: Blob) => {
    setIsCropperOpen(false);
    setIsUploading(true);
    setUploadProgress(0);

    const fileName = `${folderName}/${new Date().getTime()}-${Math.random().toString(36).substring(2)}.jpeg`;
    const storageRef = ref(storage, fileName);
    
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your image. Please try again.",
          variant: "destructive",
        });
        console.error("Upload error", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setIsUploading(false);
          toast({
            title: 'Image Uploaded!',
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          });
        });
      }
    );
  };

  const icon = iconType === 'banner'
    ? { component: <ImageUp className="h-8 w-8 text-muted-foreground mx-auto" />, text: 'Upload Banner Image' }
    : { component: <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />, text: 'Upload Logo' };

  return (
    <>
      {imageSrc && (
        <ImageCropper
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={imageSrc}
          onSave={handleSave}
          aspectRatio={aspectRatio}
        />
      )}
      <Card
        role="button"
        aria-label="Upload image"
        tabIndex={0}
        className="relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border-2 border-dashed bg-muted hover:bg-muted/80"
        style={{ aspectRatio: `${aspectRatio}` }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !isUploading && fileInputRef.current?.click()}
      >
        {value && !isUploading ? (
          <Image src={value} alt="Preview" fill className="object-cover rounded-lg" />
        ) : isUploading ? (
            <div className="flex flex-col items-center justify-center gap-4 p-4 text-center w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-sm text-muted-foreground">Uploading...</p>
                <Progress value={uploadProgress} className="w-3/4" />
            </div>
        ) : (
          <div className="text-center p-4">
            {icon.component}
            <span className="text-muted-foreground text-sm">{icon.text}</span>
            <p className="text-xs text-muted-foreground/80 mt-1">Up to {IMAGE_MAX_SIZE_MB}MB</p>
          </div>
        )}
      </Card>
      <Input
        id={`image-input-${aspectRatio}`}
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        disabled={isUploading}
      />
    </>
  );
}
