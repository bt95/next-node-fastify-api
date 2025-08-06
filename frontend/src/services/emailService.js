/**
 * Email API Service
 * Handles all API communication for email operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class EmailService {
  /**
   * Get all emails with optional search
   * @param {string} searchTerm - Optional search term
   * @returns {Promise<Object>} API response
   */
  static async getEmails(searchTerm = '') {
    try {
      const url = searchTerm 
        ? `${API_BASE_URL}/api/emails?search=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/api/emails`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw new Error('Failed to fetch emails');
    }
  }

  /**
   * Get single email by ID
   * @param {number} id - Email ID
   * @returns {Promise<Object>} API response
   */
  static async getEmailById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching email:', error);
      throw new Error('Failed to fetch email');
    }
  }

  /**
   * Create new email
   * @param {Object} emailData - Email data
   * @returns {Promise<Object>} API response
   */
  static async createEmail(emailData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating email:', error);
      throw new Error('Failed to create email');
    }
  }

  /**
   * Delete email by ID
   * @param {number} id - Email ID
   * @returns {Promise<Object>} API response
   */
  static async deleteEmail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting email:', error);
      throw new Error('Failed to delete email');
    }
  }

  /**
   * Validate email data
   * @param {Object} emailData - Email data to validate
   * @returns {Object} Validation result
   */
  static validateEmailData(emailData) {
    const errors = [];
    
    if (!emailData.to || !emailData.to.trim()) {
      errors.push('To field is required');
    }
    
    if (!emailData.subject || !emailData.subject.trim()) {
      errors.push('Subject field is required');
    }
    
    // Basic email format validation
    if (emailData.to && !this.isValidEmail(emailData.to)) {
      errors.push('Invalid email format in To field');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Basic email format validation
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
}

export default EmailService;
