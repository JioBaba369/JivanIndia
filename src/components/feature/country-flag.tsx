'use client';

import Image from 'next/image';

interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

export default function CountryFlag({ countryCode, className }: CountryFlagProps) {
  if (!countryCode) return null;

  return (
    <Image
      src={`https://flagsapi.com/${countryCode}/flat/64.png`}
      alt={`${countryCode} flag`}
      width={20}
      height={15}
      className={className}
      unoptimized
    />
  );
}
