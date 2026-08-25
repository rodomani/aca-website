import React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function Grid({ children, columns = 3, className = '', ...props }: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-8 ${gridCols[columns]} ${className}`} {...props}>
      {children}
    </div>
  );
}