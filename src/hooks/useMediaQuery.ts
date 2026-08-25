import { useState, useEffect } from 'react';

/**
 * A custom hook that returns a boolean indicating whether the provided CSS media query matches.
 * 
 * @param query - The CSS media query to evaluate (e.g., '(max-width: 768px)')
 * @returns boolean - True if the media query matches, false otherwise.
 */
export function useMediaQuery(query: string): boolean {
  // We initialize to false to prevent Next.js hydration mismatch errors on the server
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Ensure window exists (browser environment)
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);

    // Set the initial value upon mounting
    setMatches(media.matches);

    // Define the callback for when the screen size changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}