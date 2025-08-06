'use client';

import { useState, type SetStateAction } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';

interface ImageCropperProps {
  imageSrc: string;
  aspect: number;
  onCropComplete: (croppedImage: Blob) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}


export default function ImageCropper({ imageSrc, aspect, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setImgElement(e.currentTarget);
    setCrop(centerAspectCrop(width, height, aspect));
  }

  const handleCrop = async () => {
    if (completedCrop?.width && completedCrop?.height && imgElement) {
        const canvas = document.createElement('canvas');
        const scaleX = imgElement.naturalWidth / imgElement.width;
        const scaleY = imgElement.naturalHeight / imgElement.height;
        
        canvas.width = Math.floor(completedCrop.width * scaleX);
        canvas.height = Math.floor(completedCrop.height * scaleY);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        
        ctx.drawImage(
            imgElement,
            cropX,
            cropY,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
        
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCropComplete(blob);
                }
            },
            'image/jpeg',
            0.9
        );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspect}
        className="max-h-[70vh]"
      >
        <img src={imageSrc} onLoad={onImageLoad} alt="Crop preview" />
      </ReactCrop>
      <Button onClick={handleCrop} className="mt-4">
        Save Image
      </Button>
    </div>
  );
}
