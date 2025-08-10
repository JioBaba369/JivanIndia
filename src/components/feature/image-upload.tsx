
'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { UploadCloud, CheckCircle, ImageUp, Loader2, Camera, Pencil } from 'lucide-react';
import type { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  aspectRatio: number;
  toast: ReturnType<typeof useToast>['toast'];
  folderName: string;
  className?: string;
}

const IMAGE_MAX_SIZE_MB = 10;
const MAX_IMAGE_DIMENSION = 1920; // Max width/height for resizing

function getCroppedAndResizedImg(
  image: HTMLImageElement,
  crop: Crop,
  quality: number = 0.85
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  let targetWidth = cropWidth;
  let targetHeight = cropHeight;

  // Resize logic
  if (targetWidth > MAX_IMAGE_DIMENSION || targetHeight > MAX_IMAGE_DIMENSION) {
    if (cropWidth > cropHeight) {
      targetWidth = MAX_IMAGE_DIMENSION;
      targetHeight = (MAX_IMAGE_DIMENSION / cropWidth) * cropHeight;
    } else {
      targetHeight = MAX_IMAGE_DIMENSION;
      targetWidth = (MAX_IMAGE_DIMENSION / cropHeight) * cropWidth;
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Canvas context is not available.'));
  }

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}


export default function ImageUpload({
  value,
  onChange,
  aspectRatio,
  toast,
  folderName,
  className,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const [preview, setPreview] = useState<string | undefined>(value);
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
  });
  
  const [crop, setCrop] = useState<Crop>();
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: 'px',
          width: Math.min(width, height * aspectRatio),
          height: Math.min(height, width / aspectRatio),
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };


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
      setCrop(undefined); // Clear previous crop state
      setSourceImage(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const handleUploadCroppedImage = async () => {
    if (!imgRef.current || !crop || !crop.width || !crop.height) {
      toast({ title: 'Crop Failed', description: 'Invalid crop area. Please try again.', variant: 'destructive' });
      return;
    }
    
    setCropModalOpen(false);
    setUploadState({ isUploading: true, progress: 0 });

    try {
      const imageBlob = await getCroppedAndResizedImg(imgRef.current, crop);
      const fileName = `${folderName}/${uuidv4()}.webp`;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, imageBlob, {
        contentType: 'image/webp',
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadState((prevState) => ({ ...prevState, progress }));
        },
        (error) => {
          console.error('Upload error', error);
          setUploadState({ isUploading: false, progress: 0 });
          toast({ title: 'Upload Failed', description: 'There was an error uploading your image. Please try again.', variant: 'destructive' });
          resetFileInput();
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setUploadState({ isUploading: false, progress: 0 });
          setPreview(downloadURL);
          toast({ title: 'Image Uploaded!', description: 'Your image has been successfully uploaded.', icon: <CheckCircle className="h-5 w-5 text-green-500" /> });
          resetFileInput();
        }
      );
    } catch (e) {
      console.error(e);
      setUploadState({ isUploading: false, progress: 0 });
      toast({ title: 'Crop Failed', description: 'Could not process the image. Please try again.', variant: 'destructive' });
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          <span>{uploadState.isUploading ? 'Uploading...' : 'Change Picture'}</span>
        </Button>
      );
    }
    return (
      <Card
        role="button"
        aria-label="Upload image"
        tabIndex={0}
        className={cn(
          'group relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border-2 border-dashed bg-muted hover:bg-muted/80',
          className
        )}
        style={{ aspectRatio: `${aspectRatio}` }}
        onClick={() => !uploadState.isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) =>
          e.key === 'Enter' &&
          !uploadState.isUploading &&
          fileInputRef.current?.click()
        }
      >
        {preview && !uploadState.isUploading && (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-white">
                <Pencil className="h-5 w-5" /> Change
              </div>
            </div>
          </>
        )}
        {uploadState.isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 text-center w-full bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={uploadState.progress} className="w-3/4" />
          </div>
        )}
        {!preview && !uploadState.isUploading && (
          <div className="text-center p-4">
            {aspectRatio > 1 ? (
              <ImageUp className="h-8 w-8 text-muted-foreground mx-auto" />
            ) : (
              <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />
            )}
            <span className="text-muted-foreground text-sm">
              {aspectRatio > 1 ? 'Upload Banner' : 'Upload Logo'}
            </span>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Up to {IMAGE_MAX_SIZE_MB}MB
            </p>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
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
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop & Resize Image</DialogTitle>
          </DialogHeader>
          {sourceImage && (
            <div className="relative w-full h-96 bg-muted">
                <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    aspect={aspectRatio}
                    className="max-h-96"
                >
                    <Image
                        ref={imgRef}
                        src={sourceImage}
                        alt="Source for cropping"
                        fill
                        style={{ objectFit: 'contain' }}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUploadCroppedImage} disabled={!crop}>
              Crop & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
