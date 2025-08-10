"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

export function ImageUploader({ defaultImage, dataAiHint }: { defaultImage?: string, dataAiHint?: string }) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-2 aspect-video flex items-center justify-center relative group">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        {image ? (
          <>
            <Image 
              src={image} 
              alt="Uploaded image" 
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              data-ai-hint={dataAiHint}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button variant="ghost" className="flex flex-col h-full w-full" onClick={handleUploadClick}>
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">Click to upload image</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}