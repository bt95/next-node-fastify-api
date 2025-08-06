import { Snackbar, Alert } from '@mui/material';

/**
 * NotificationSnackbar Component
 * Reusable snackbar component for displaying notifications
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the snackbar is open
 * @param {string} props.message - Message to display
 * @param {string} props.severity - Severity level ('success', 'error', 'warning', 'info')
 * @param {Function} props.onClose - Callback when snackbar is closed
 * @param {number} props.autoHideDuration - Auto hide duration in milliseconds
 */
export default function NotificationSnackbar({
  open,
  message,
  severity = 'success',
  onClose,
  autoHideDuration = 4000
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
