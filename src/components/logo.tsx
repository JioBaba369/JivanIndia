
import React from 'react';

interface LogoProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
}

export default function Logo({ as: Component = 'div', ...props }: LogoProps) {
  return (
    <Component className="flex items-center gap-2" aria-label="JivanIndia.co homepage" {...props}>
        <div className="h-8 w-8">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0007 5.25C10.0367 3.40714 7.15837 3.51429 5.38512 5.47857C3.61188 7.44286 3.61188 10.5571 5.38512 12.5214L12.0007 19.7143L18.6163 12.5214C20.3895 10.5571 20.3895 7.44286 18.6163 5.47857C16.843 3.51429 13.9647 3.40714 12.0007 5.25Z" className="text-primary fill-current"/>
                <g className="text-primary-foreground fill-current">
                    <path d="M12 15C12.8284 15 13.5 14.3284 13.5 13.5C13.5 12.6716 12.8284 12 12 12C11.1716 12 10.5 12.6716 10.5 13.5C10.5 14.3284 11.1716 15 12 15Z" />
                    <path d="M12 11.5C12.4142 11.5 12.75 11.1642 12.75 10.75V8.25C12.75 7.83579 12.4142 7.5 12 7.5C11.5858 7.5 11.25 7.83579 11.25 8.25V10.75C11.25 11.1642 11.5858 11.5 12 11.5Z" />
                </g>
            </svg>
        </div>
        <span className="font-headline text-2xl font-bold">JivanIndia.co</span>
    </Component>
  );
}
