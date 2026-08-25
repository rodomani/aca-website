import React from 'react';

// 1. We keep our specific variants
type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

// 2. We can optionally narrow the HTMLAttributes to match our specific elements, 
interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
}

export function Typography({ variant = 'p', children, className = '', ...props }: TypographyProps) {
  const baseStyles = 'text-[#2C2C2C]'; 
  
  // 3. THE FIX: Instead of 'keyof React.JSX.IntrinsicElements', 
  // we strictly type the 'element' property to match our TypographyVariant strings.
  const variantMap: Record<TypographyVariant, { element: TypographyVariant; styles: string }> = {
    h1: { element: 'h1', styles: 'font-serif text-4xl md:text-5xl font-normal text-[#1A3C2F] leading-tight mb-6' },
    h2: { element: 'h2', styles: 'font-serif text-3xl md:text-4xl font-normal text-[#1A3C2F] leading-tight mb-4' },
    h3: { element: 'h3', styles: 'font-serif text-2xl md:text-3xl font-normal text-[#1A3C2F] mb-3' },
    h4: { element: 'h4', styles: 'font-sans text-lg font-semibold tracking-wide uppercase mb-2' },
    p: { element: 'p', styles: 'font-sans text-base leading-relaxed mb-4' },
    span: { element: 'span', styles: 'font-sans text-sm' },
  };

  const Component = variantMap[variant].element;
  const combinedClassName = `${baseStyles} ${variantMap[variant].styles} ${className}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}