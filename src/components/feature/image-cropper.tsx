
'use client';

import { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (blob: Blob) => void;
  aspectRatio?: number;
}

const MAX_WIDTH = 1200;

export default function ImageCropper({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  aspectRatio = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    let targetWidth = crop.width * scaleX;
    let targetHeight = crop.height * scaleY;

    if (targetWidth > MAX_WIDTH) {
        const reductionFactor = MAX_WIDTH / targetWidth;
        targetWidth = MAX_WIDTH;
        targetHeight = targetHeight * reductionFactor;
    }

    canvas.width = Math.floor(targetWidth);
    canvas.height = Math.floor(targetHeight);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return Promise.reject(new Error("Could not get canvas context"));
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
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
            'image/jpeg',
            0.90 // Slightly lower quality for better compression
        );
    });
  };

  const handleSaveCrop = async () => {
    const image = imgRef.current;
    if (!image || !crop || !crop.width || !crop.height) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
        const blob = await getCroppedImg(image, crop);
        onSave(blob);
    } catch(e) {
        console.error("Cropping failed", e);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crop & Resize Image</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex justify-center">
            {imageSrc && (
                <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    aspect={aspectRatio}
                    className="max-h-[70vh]"
                >
                    <img ref={imgRef} src={imageSrc} alt="Image to crop" onLoad={onImageLoad} style={{maxHeight: '70vh'}}/>
                </ReactCrop>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleSaveCrop} disabled={isProcessing}>
             {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cropping...</> : 'Crop & Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
