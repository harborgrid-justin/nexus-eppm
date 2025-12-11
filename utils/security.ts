
/**
 * Basic Input Sanitization to prevent XSS.
 * Removes common dangerous tags and attributes.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace HTML tags
  const text = input.replace(/<[^>]*>?/gm, '');
  
  // Explicitly remove javascript: protocols
  return text.replace(/javascript:/gi, '');
};

/**
 * Validates a URL to ensure it points to a safe protocol.
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch (e) {
    return false;
  }
};
