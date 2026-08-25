export const theme = {
  colors: {
    // Brand Colors from ACA Logo
    primary: '#1A3C2F',    // Deep Forest Green
    background: '#F4F1E9', // Warm Cream / Parchment
    
    // UI Colors
    text: {
      main: '#2C2C2C',     // Charcoal for readable body text
      muted: '#6B7280',    // Lighter gray for secondary text/dates
      inverse: '#F4F1E9',  // Cream text for when placed on dark green background
    },
    
    // Borders & Dividers
    border: '#E2DEC6',     // A slightly darker cream for subtle separation lines
  },
  
  typography: {
    // We will map these to Next.js font variables later in your layout
    fonts: {
      serif: 'var(--font-playfair), serif', // Elegant, for headings
      sans: 'var(--font-inter), sans-serif', // Clean, for body & UI
    },
    
    // Standardized spacing for the grid layouts (minimalist style)
    layout: {
      maxWidth: '1200px',
      sectionPadding: '4rem',
    }
  }
} as const;

// Exporting a type so you can use it in your styled components or Tailwind config if needed
export type Theme = typeof theme;