
'use client';

import Image from 'next/image';
import { Globe } from 'lucide-react';

interface CountryFlagProps {
  countryName: string;
  className?: string;
}

const flagData: Record<string, string> = {
  'usa': 'https://flagcdn.com/us.svg',
  'united states': 'https://flagcdn.com/us.svg',
  'united states of america': 'https://flagcdn.com/us.svg',
  'canada': 'https://flagcdn.com/ca.svg',
  'united kingdom': 'https://flagcdn.com/gb.svg',
  'uk': 'https://flagcdn.com/gb.svg',
  'great britain': 'https://flagcdn.com/gb.svg',
  'australia': 'https://flagcdn.com/au.svg',
  'new zealand': 'https://flagcdn.com/nz.svg',
  'india': 'https://flagcdn.com/in.svg',
  'singapore': 'https://flagcdn.com/sg.svg',
  'malaysia': 'https://flagcdn.com/my.svg',
  'united arab emirates': 'https://flagcdn.com/ae.svg',
  'uae': 'https://flagcdn.com/ae.svg',
  'saudi arabia': 'https://flagcdn.com/sa.svg',
  'qatar': 'https://flagcdn.com/qa.svg',
  'south africa': 'https://flagcdn.com/za.svg',
  'germany': 'https://flagcdn.com/de.svg',
  'france': 'https://flagcdn.com/fr.svg',
  'netherlands': 'https://flagcdn.com/nl.svg',
  'ireland': 'https://flagcdn.com/ie.svg',
  'switzerland': 'https://flagcdn.com/ch.svg',
  'sweden': 'https://flagcdn.com/se.svg',
  'norway': 'https://flagcdn.com/no.svg',
  'denmark': 'https://flagcdn.com/dk.svg',
};


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
