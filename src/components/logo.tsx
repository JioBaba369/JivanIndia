
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAbout } from '@/hooks/use-about';

interface LogoProps extends Omit<React.HTMLAttributes<HTMLElement>, 'as'> {
    as?: React.ElementType;
    href?: string;
}

export default function Logo({ as: Component = 'div', href, ...props }: LogoProps) {
  const { aboutContent } = useAbout();

  const DefaultLogo = () => (
    <>
        <div className="h-8 w-8">
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0007 5.25C10.0367 3.40714 7.15837 3.51429 5.38512 5.47857C3.61188 7.44286 3.61188 10.5571 5.38512 12.5214L12.0007 19.7143L18.6163 12.5214C20.3895 10.5571 20.3895 7.44286 18.6163 5.47857C16.843 3.51429 13.9647 3.40714 12.0007 5.25Z" className="text-primary" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
        </div>
        <span className="font-headline text-2xl font-bold">
            JivanIndia
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
