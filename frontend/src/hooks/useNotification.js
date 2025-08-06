import { useState } from 'react';

/**
 * Custom hook for managing notification/snackbar state
 * Provides a clean API for showing success, error, and info messages
 * 
 * @returns {Object} Notification state and methods
 */
export function useNotification() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error' | 'warning' | 'info'
  });

  /**
   * Show a success notification
   * @param {string} message - Success message to display
   */
  const showSuccess = (message) => {
    setNotification({
      open: true,
      message,
      severity: 'success'
    });
  };

  /**
   * Show an error notification
   * @param {string} message - Error message to display
   */
  const showError = (message) => {
    setNotification({
      open: true,
      message,
      severity: 'error'
    });
  };

  /**
   * Show a warning notification
   * @param {string} message - Warning message to display
   */
  const showWarning = (message) => {
    setNotification({
      open: true,
      message,
      severity: 'warning'
    });
  };

  /**
   * Show an info notification
   * @param {string} message - Info message to display
   */
  const showInfo = (message) => {
    setNotification({
      open: true,
      message,
      severity: 'info'
    });
  };

  /**
   * Close the notification
   */
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification
  };
}
