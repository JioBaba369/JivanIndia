
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAbout } from '@/hooks/use-about';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface LogoProps extends Omit<React.HTMLAttributes<HTMLElement>, 'as'> {
    as?: React.ElementType;
    href?: string;
}

export default function Logo({ as: Component = 'div', href, className, ...props }: LogoProps) {
  const { aboutContent } = useAbout();

  const DefaultLogo = () => (
    <>
        <div className="h-8 w-8 text-primary">
             <Heart className="h-full w-full fill-current"/>
        </div>
        <span className={cn("font-headline text-2xl font-bold", className)}>
            <span>JivanIndia</span>
            <span className="text-primary">.co</span>
        </span>
    </>
  );

  const logoContent = (
    <div className="flex items-center gap-2" {...props}>
      {aboutContent.logoUrl ? (
          <div className="relative h-10 w-40">
              <Image
                  src={aboutContent.logoUrl}
                  alt="JivanIndia.co Logo"
                  fill
                  className="object-contain"
                  sizes="160px"
              />
          </div>
      ) : (
          <DefaultLogo />
      )}
    </div>
  );
  
  if (Component === Link && href) {
    return (
        <Link href={href} aria-label="JivanIndia.co homepage">
            {logoContent}
        </Link>
    );
  }

  return (
    <div {...props}>
      {logoContent}
    </div>
  );
}
