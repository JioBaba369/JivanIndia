
'use client';

import Image from 'next/image';
import { flagData } from '@/data/flags';
import { Globe } from 'lucide-react';

interface CountryFlagProps {
  countryName: string;
  className?: string;
}

export default function CountryFlag({ countryName, className }: CountryFlagProps) {
  const normalizedCountryName = countryName.toLowerCase();
  const flagUrl = flagData[normalizedCountryName];

  if (flagUrl) {
    return (
      <Image
        src={flagUrl}
        alt={`${countryName} flag`}
        width={32}
        height={32}
        className="object-cover h-full w-full"
      />
    );
  }

  // Fallback for countries not in our data list
  return (
     <div className="flex h-full w-full items-center justify-center bg-secondary">
        <Globe className="h-5 w-5 text-muted-foreground" />
      </div>
  );
}
