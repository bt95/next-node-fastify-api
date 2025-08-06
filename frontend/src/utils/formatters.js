/**
 * Utility functions for formatting and text manipulation
 */

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Truncate text for preview with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (typeof text !== 'string') return String(text);
  
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Sanitize email field for display
 * @param {string} email - Email string to sanitize
 * @returns {string} Sanitized email string
 */
export const sanitizeEmail = (email) => {
  if (!email) return '';
  return email.trim();
};

/**
 * Get initials from email address for avatar
 * @param {string} email - Email address
 * @returns {string} Initials (max 2 characters)
 */
export const getEmailInitials = (email) => {
  if (!email) return '??';
  
  const parts = email.split('@')[0].split('.');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return email.substring(0, 2).toUpperCase();
};

/**
 * Format email recipients for display
 * @param {string} to - To field
 * @param {string} cc - CC field
 * @param {string} bcc - BCC field
 * @returns {Object} Formatted recipient object
 */
export const formatRecipients = (to, cc, bcc) => {
  return {
    to: sanitizeEmail(to),
    cc: sanitizeEmail(cc),
    bcc: sanitizeEmail(bcc),
    hasCC: Boolean(cc && cc.trim()),
    hasBCC: Boolean(bcc && bcc.trim())
  };
};

/**
 * Generate a unique key for React list items
 * @param {string} prefix - Prefix for the key
 * @param {number|string} id - Unique identifier
 * @returns {string} Unique key
 */
export const generateKey = (prefix, id) => {
  return `${prefix}-${id}-${Date.now()}`;
};
