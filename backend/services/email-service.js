/**
 * Email Service Layer
 * Contains all business logic for email operations
 */
class EmailService {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all emails with optional search filtering
   * @param {string} searchTerm - Optional search term to filter emails
   * @returns {Promise<Array>} Array of emails
   */
  async getEmails(searchTerm = '') {
    let query = this.db('emails').select('*').orderBy('created_at', 'desc');
    
    if (searchTerm) {
      query = query.where(function() {
        this.where('to', 'like', `%${searchTerm}%`)
            .orWhere('cc', 'like', `%${searchTerm}%`)
            .orWhere('bcc', 'like', `%${searchTerm}%`)
            .orWhere('subject', 'like', `%${searchTerm}%`)
            .orWhere('body', 'like', `%${searchTerm}%`);
      });
    }
    
    return await query;
  }

  /**
   * Get a single email by ID
   * @param {number} id - Email ID
   * @returns {Promise<Object|null>} Email object or null if not found
   */
  async getEmailById(id) {
    return await this.db('emails').where('id', id).first();
  }

  /**
   * Create a new email
   * @param {Object} emailData - Email data object
   * @param {string} emailData.to - Recipient email address
   * @param {string} emailData.cc - CC email addresses
   * @param {string} emailData.bcc - BCC email addresses
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.body - Email body content
   * @returns {Promise<Object>} Created email object
   */
  async createEmail(emailData) {
    const { to, cc, bcc, subject, body } = emailData;
    
    // Validate required fields
    if (!to || !subject) {
      throw new Error('To and subject fields are required');
    }
    
    const sanitizedData = {
      to: to.trim(),
      cc: cc ? cc.trim() : '',
      bcc: bcc ? bcc.trim() : '',
      subject: subject.trim(),
      body: body ? body.trim() : ''
    };
    
    const [result] = await this.db('emails').insert(sanitizedData).returning('*');
    return result;
  }

  /**
   * Delete an email by ID
   * @param {number} id - Email ID
   * @returns {Promise<number>} Number of deleted rows
   */
  async deleteEmail(id) {
    return await this.db('emails').where('id', id).del();
  }

  /**
   * Validate email data
   * @param {Object} emailData - Email data to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateEmailData(emailData) {
    const errors = [];
    
    if (!emailData.to || !emailData.to.trim()) {
      errors.push('To field is required');
    }
    
    if (!emailData.subject || !emailData.subject.trim()) {
      errors.push('Subject field is required');
    }
    
    // Basic email format validation for 'to' field
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
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
}

export default EmailService;
