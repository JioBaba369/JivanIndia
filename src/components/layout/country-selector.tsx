
'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useCountries } from '@/hooks/use-countries';
import CountryFlag from '@/components/feature/country-flag';

interface CountrySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export default function CountrySelector({
  value,
  onValueChange,
  className,
}: CountrySelectorProps) {
  const { countries } = useCountries();
  const [open, setOpen] = useState(false);

  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name,
    code: country.code,
  }));

  const selectedOption = countryOptions.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption && <CountryFlag countryCode={selectedOption.code} />}
            <span className="truncate">
              {selectedOption ? selectedOption.label : 'Select country...'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countryOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onValueChange(option.value === value ? '' : option.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <CountryFlag countryCode={option.code} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
