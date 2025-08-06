
import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}

export default function Logo({ as: Component = 'div', ...props }: LogoProps) {
  return (
    <Component className="flex items-center gap-2" aria-label="JivanIndia.co homepage" {...props}>
        <Heart className="h-8 w-8 text-primary fill-primary" />
        <span className="font-headline text-2xl font-bold">JivanIndia.co</span>
    </Component>
  );
}
