
'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (value?: string) => void;
  aspectRatio: number;
  folderName: string;
  toast: (options: { title: string; description: string; variant?: 'default' | 'destructive' }) => void;
}

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

function getCroppedAndResizedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  aspectRatio: number,
  maxSize: { width: number, height: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    let targetWidth = crop.width;
    let targetHeight = crop.height;

    if (targetWidth > maxSize.width) {
      targetWidth = maxSize.width;
      targetHeight = targetWidth / aspectRatio;
    }
    if (targetHeight > maxSize.height) {
      targetHeight = maxSize.height;
      targetWidth = targetHeight * aspectRatio;
    }
    
    if (targetWidth === 0 || targetHeight === 0) {
      reject(new Error("Crop dimensions cannot be zero."));
      return;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error("Could not get canvas context."));
      return;
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty."));
        return;
      }
      resolve(blob);
    }, 'image/webp', 0.9);
  });
}

export default function ImageUpload({ value, onChange, aspectRatio, folderName, toast }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSourceImage(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
      setIsCropDialogOpen(true);
    }
  };
  
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspectRatio, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };
  
  const handleCropAndUpload = async () => {
    if (completedCrop && imgRef.current) {
        setIsUploading(true);
        setIsCropDialogOpen(false);
      try {
        const imageBlob = await getCroppedAndResizedImg(
          imgRef.current,
          completedCrop,
          aspectRatio,
          { width: MAX_WIDTH, height: MAX_HEIGHT }
        );
        const fileName = `${folderName}/${uuidv4()}.webp`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, imageBlob);
        const downloadURL = await getDownloadURL(storageRef);
        onChange(downloadURL);
        toast({ title: 'Upload Successful', description: 'Your image has been uploaded.' });
      } catch (error) {
        console.error("Error during image processing or upload:", error);
        toast({ title: 'Crop Failed', description: 'Could not process the image. Please try again.', variant: 'destructive' });
      } finally {
        setIsUploading(false);
        setSourceImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemoveImage = () => {
    onChange(undefined);
  };

  return (
    <>
      <div className="w-full">
        {value ? (
          <div className="relative group">
            <div className="aspect-[16/9] w-full rounded-md overflow-hidden relative" style={{ aspectRatio }}>
                <Image src={value} alt="Uploaded Image" fill className="object-cover" />
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button type="button" size="icon" variant="destructive" onClick={handleRemoveImage}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <label
              className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
              style={{ aspectRatio }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">Click or drag file to upload</span>
                </>
              )}
              <Input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
        )}
      </div>

      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Crop Your Image</DialogTitle>
          </DialogHeader>
          <div className="mt-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {sourceImage && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
              >
                <img ref={imgRef} alt="Crop me" src={sourceImage} onLoad={onImageLoad} style={{maxHeight: "60vh"}} />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCropAndUpload}>Crop & Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
