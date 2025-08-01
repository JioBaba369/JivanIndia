
import { Sprout } from "lucide-react";
import React from 'react';

interface LogoProps {
    as?: React.ElementType;
    [key: string]: any; 
}

export default function Logo({ as: Component = 'div', ...props }: LogoProps) {
  return (
    <Component className="flex items-center gap-2" aria-label="JivanIndia.co homepage" {...props}>
        <Sprout className="h-7 w-7 text-primary" />
        <span className="font-headline text-2xl font-bold">JivanIndia.co</span>
    </Component>
  );
}
