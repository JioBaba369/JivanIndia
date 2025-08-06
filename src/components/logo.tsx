
import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}

export default function Logo({ as: Component = 'div', ...props }: LogoProps) {
  return (
    <Component className="flex items-center gap-2" aria-label="JivanIndia.co homepage" {...props}>
        <span className="font-headline text-4xl text-primary font-bold">Ω</span>
        <span className="font-headline text-2xl font-bold">JivanIndia.co</span>
    </Component>
  );
}
