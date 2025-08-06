import { useState, useEffect, useCallback } from 'react';
import EmailService from '../services/emailService';
import { useDebounce } from './useDebounce';
import { useNotification } from './useNotification';

/**
 * Custom hook for managing email operations
 * Handles fetching, creating, and managing email state
 * 
 * @returns {Object} Email state and operations
 */
export function useEmails() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { showSuccess, showError } = useNotification();
  
  // Debounce search term by 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  /**
   * Fetch emails from the API
   * @param {string} search - Optional search term
   */
  const fetchEmails = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await EmailService.getEmails(search);
      
      if (result.success) {
        setEmails(result.data);
        // Clear selected email if it's not in the filtered results
        if (selectedEmail && !result.data.find(email => email.id === selectedEmail.id)) {
          setSelectedEmail(null);
        }
      } else {
        throw new Error(result.error || 'Failed to fetch emails');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to connect to server';
      setError(errorMessage);
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedEmail]);

  /**
   * Create a new email
   * @param {Object} emailData - Email data to create
   * @returns {Promise<boolean>} Success status
   */
  const createEmail = async (emailData) => {
    try {
      // Validate email data
      const validation = EmailService.validateEmailData(emailData);
      if (!validation.isValid) {
        showError(validation.errors.join(', '));
        return false;
      }

      const result = await EmailService.createEmail(emailData);
      
      if (result.success) {
        showSuccess('Email saved successfully!');
        // Refresh emails list
        await fetchEmails(debouncedSearchTerm);
        return true;
      } else {
        throw new Error(result.error || 'Failed to save email');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to connect to server';
      showError(errorMessage);
      console.error('Error creating email:', err);
      return false;
    }
  };

  /**
   * Delete an email
   * @param {number} emailId - ID of email to delete
   * @returns {Promise<boolean>} Success status
   */
  const deleteEmail = async (emailId) => {
    try {
      const result = await EmailService.deleteEmail(emailId);
      
      if (result.success) {
        showSuccess('Email deleted successfully!');
        // Remove from local state
        setEmails(prev => prev.filter(email => email.id !== emailId));
        // Clear selection if deleted email was selected
        if (selectedEmail && selectedEmail.id === emailId) {
          setSelectedEmail(null);
        }
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete email');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete email';
      showError(errorMessage);
      console.error('Error deleting email:', err);
      return false;
    }
  };

  /**
   * Select an email
   * @param {Object} email - Email to select
   */
  const selectEmail = (email) => {
    setSelectedEmail(email);
  };

  /**
   * Clear email selection
   */
  const clearSelection = () => {
    setSelectedEmail(null);
  };

  /**
   * Update search term
   * @param {string} term - New search term
   */
  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  /**
   * Clear search and reset
   */
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Fetch emails when debounced search term changes
  useEffect(() => {
    fetchEmails(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchEmails]);

  return {
    // State
    emails,
    selectedEmail,
    searchTerm,
    loading,
    error,
    
    // Actions
    fetchEmails,
    createEmail,
    deleteEmail,
    selectEmail,
    clearSelection,
    updateSearchTerm,
    clearSearch,
    
    // Computed values
    hasEmails: emails.length > 0,
    hasSelection: Boolean(selectedEmail),
    isSearching: Boolean(searchTerm.trim())
  };
}
