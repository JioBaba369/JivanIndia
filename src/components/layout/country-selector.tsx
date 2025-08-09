
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useCommunities } from '@/hooks/use-communities';
import { useMemo } from 'react';
import CountryFlag from '../feature/country-flag';
import { ALL_COUNTRIES_VALUE } from '@/hooks/use-country';

interface CountrySelectorProps {
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
}

export default function CountrySelector({ selectedCountry, setSelectedCountry }: CountrySelectorProps) {
  const { communities } = useCommunities();

  const availableCountries = useMemo(() => {
    const countries = new Set(communities.map(c => c.country).filter(Boolean));
    return [ALL_COUNTRIES_VALUE, ...Array.from(countries).sort()];
  }, [communities]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Globe className="mr-2 h-4 w-4" />
          <span>{selectedCountry}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select a Country</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedCountry} onValueChange={setSelectedCountry}>
          {availableCountries.map(country => (
            <DropdownMenuRadioItem key={country} value={country} className="gap-2">
              {country !== ALL_COUNTRIES_VALUE ? (
                <div className="w-5 h-4 rounded-sm overflow-hidden flex items-center justify-center">
                    <CountryFlag countryName={country} />
                </div>
              ) : (
                <Globe className="h-4 w-4" />
              )}
              <span>{country}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
