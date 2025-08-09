
'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { UploadCloud, CheckCircle, ImageUp, Loader2, Camera, Pencil } from 'lucide-react';
import type { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  aspectRatio: number;
  toast: ReturnType<typeof useToast>['toast'];
  folderName: string; 
  className?: string;
}

const IMAGE_MAX_SIZE_MB = 10;

export default function ImageUpload({
  value,
  onChange,
  aspectRatio,
  toast,
  folderName,
  className
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState({
      isUploading: false,
      progress: 0,
  });
  
  const resetFileInput = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > IMAGE_MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: 'Image Too Large',
          description: `Please select an image smaller than ${IMAGE_MAX_SIZE_MB}MB.`,
          variant: 'destructive',
        });
        resetFileInput();
        return;
      }
      
      setUploadState({ isUploading: true, progress: 0 });

      const fileName = `${folderName}/${new Date().getTime()}-${Math.random().toString(36).substring(2)}.jpeg`;
      const storageRef = ref(storage, fileName);
      
      try {
        const uploadTask = uploadBytesResumable(storageRef, file, { contentType: 'image/jpeg' });

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadState(prevState => ({ ...prevState, progress }));
          },
          (error) => {
              console.error("Upload error", error);
              setUploadState({ isUploading: false, progress: 0 });
              toast({
                  title: "Upload Failed",
                  description: "There was an error uploading your image. Please try again.",
                  variant: "destructive",
              });
              resetFileInput();
          },
          async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              onChange(downloadURL);
              setUploadState({ isUploading: false, progress: 0 });
              toast({
                  title: 'Image Uploaded!',
                  icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              });
              resetFileInput();
          }
        );
      } catch (error) {
        setUploadState({ isUploading: false, progress: 0 });
        toast({
          title: "Upload Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        console.error("Upload error", error);
        resetFileInput();
      }
    }
  };
  
  const isButtonVariant = folderName === 'profile-pictures';

  const UploadButtonContent = () => {
    if (isButtonVariant) {
        return (
            <Button
                type="button"
                variant="outline"
                onClick={() => !uploadState.isUploading && fileInputRef.current?.click()}
                disabled={uploadState.isUploading}
            >
                {uploadState.isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                ) : (
                    <Camera className="mr-2 h-4 w-4" />
                )}
                <span>{uploadState.isUploading ? 'Uploading...' : 'Change Picture'}</span>
            </Button>
        )
    }
    return (
        <Card
            role="button"
            aria-label="Upload image"
            tabIndex={0}
            className={`group relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border-2 border-dashed bg-muted hover:bg-muted/80 ${className}`}
            style={{ aspectRatio: `${aspectRatio}` }}
            onClick={() => !uploadState.isUploading && fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && !uploadState.isUploading && fileInputRef.current?.click()}
            >
            {value && !uploadState.isUploading ? (
            <>
              <Image src={value} alt="Preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-white">
                  <Pencil className="h-5 w-5"/> Change
                </div>
              </div>
            </>
            ) : uploadState.isUploading ? (
                <div className="flex flex-col items-center justify-center gap-4 p-4 text-center w-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                    <Progress value={uploadState.progress} className="w-full" />
                </div>
            ) : (
            <div className="text-center p-4">
                {aspectRatio > 1 ? <ImageUp className="h-8 w-8 text-muted-foreground mx-auto"/> : <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" /> }
                <span className="text-muted-foreground text-sm">{aspectRatio > 1 ? 'Upload Banner' : 'Upload Logo'}</span>
                <p className="text-xs text-muted-foreground/80 mt-1">Up to {IMAGE_MAX_SIZE_MB}MB</p>
            </div>
            )}
        </Card>
    );
  }

  return (
    <>
      <UploadButtonContent />
      <Input
        id={`image-input-${folderName}`}
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        disabled={uploadState.isUploading}
      />
    </>
  );
}
