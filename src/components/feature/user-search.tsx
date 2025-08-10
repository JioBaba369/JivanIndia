
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/hooks/use-search';
import type { User } from '@/hooks/use-auth';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onUserFound: (user: User | null) => void;
  className?: string;
  placeholder?: string;
}

export function EmailInput({ value, onChange, onUserFound, className, placeholder }: EmailInputProps) {
  const [userFound, setUserFound] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { validateEmail } = useSearch();

  useEffect(() => {
    const debouncedValidate = async () => {
      if (!value || !value.includes('@')) {
        setUserFound(null);
        onUserFound(null);
        return;
      }

      setIsLoading(true);
      const user = await validateEmail(value);
      setUserFound(user);
      onUserFound?.(user);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(debouncedValidate, 500);
    return () => clearTimeout(debounceTimer);
  }, [value, onUserFound, validateEmail]);

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="email"
        placeholder={placeholder || "Enter manager's email"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "pr-10",
          userFound && "border-green-500 focus-visible:ring-green-500",
          !userFound && value.includes('@') && !isLoading && "border-red-500 focus-visible:ring-red-500"
        )}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : userFound ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : !userFound && value.length > 5 && !isLoading ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
        ) : null}
      </div>
    </div>
  );
}
