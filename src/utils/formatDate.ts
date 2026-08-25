/**
 * Formats a date string or Date object into a readable string.
 * Defaults to the Korean locale standard (YYYY. MM. DD).
 * 
 * @param date - The date to format (ISO string, timestamp, or Date object)
 * @param locale - The locale string (defaults to 'ko-KR')
 * @returns A formatted date string
 */
export function formatDate(date: string | number | Date, locale: string = 'ko-KR'): string {
  if (!date) return '';

  try {
    const dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn(`Invalid date provided to formatDate: ${date}`);
      return '';
    }

    // Format the date using the browser's Intl API
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
    
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Alternative formatter if you need a more detailed timestamp (e.g., for internal admin views)
 */
export function formatDateTime(date: string | number | Date, locale: string = 'ko-KR'): string {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // Uses AM/PM (오전/오후 in ko-KR)
    }).format(dateObj);
  } catch (error) {
    return '';
  }
}