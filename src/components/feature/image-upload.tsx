
'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { UploadCloud, CheckCircle, ImageUp } from 'lucide-react';
import ImageCropper from './image-cropper';
import type { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  aspectRatio: number;
  toast: ReturnType<typeof useToast>['toast'];
  iconType?: 'banner' | 'logo';
}

const IMAGE_MAX_SIZE_MB = 4;

export default function ImageUpload({
  value,
  onChange,
  aspectRatio,
  toast,
  iconType = 'logo',
}: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (e.target) e.target.value = ''; // Clear input
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (url: string) => {
    onChange(url);
    toast({
      title: 'Image Uploaded!',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
    setIsCropperOpen(false);
  };
  
  const icon = iconType === 'banner' 
    ? { component: <ImageUp className="h-8 w-8 text-muted-foreground mx-auto" />, text: 'Upload Banner Image' }
    : { component: <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />, text: 'Upload Community Logo' };

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
        className="relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-muted hover:bg-muted/80"
        style={{ aspectRatio: `${aspectRatio}` }}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        {value ? (
          <Image src={value} alt="Preview" fill className="object-cover rounded-lg" />
        ) : (
          <div className="text-center">
            {icon.component}
            <span className="text-muted-foreground text-sm">{icon.text}</span>
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
      />
    </>
  );
}
