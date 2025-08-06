import React, { useState } from 'react';
import {
  Box,
  Grid,
  Fab,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';

// Import custom hooks
import { useEmails } from '../hooks/useEmails';
import { useNotification } from '../hooks/useNotification';

// Import components
import EmailSidebar from '../components/EmailSidebar/EmailSidebar';
import EmailDetail from '../components/EmailDetail/EmailDetail';
import ComposeModal from '../components/ComposeModal/ComposeModal';
import NotificationSnackbar from '../components/common/NotificationSnackbar';

export default function Home() {
  // State for compose modal
  const [composeOpen, setComposeOpen] = useState(false);
  const [composing, setComposing] = useState(false);

  // Custom hooks
  const {
    emails,
    selectedEmail,
    searchTerm,
    loading,
    error,
    selectEmail,
    updateSearchTerm,
    createEmail,
  } = useEmails();

  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Compose modal handlers
  const handleComposeOpen = () => setComposeOpen(true);
  const handleComposeClose = () => setComposeOpen(false);

  const handleComposeSend = async (emailData) => {
    setComposing(true);
    try {
      await createEmail(emailData);
      showSuccess('Email sent successfully!');
      setComposeOpen(false);
    } catch (error) {
      showError('Failed to send email. Please try again.');
    } finally {
      setComposing(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Grid container sx={{ flex: 1, height: '100%' }}>
        {/* Email Sidebar */}
        <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}>
          <EmailSidebar
            emails={emails}
            selectedEmail={selectedEmail}
            searchTerm={searchTerm}
            loading={loading}
            error={error}
            onEmailSelect={selectEmail}
            onSearchChange={updateSearchTerm}
          />
        </Grid>

        {/* Email Detail View */}
        <Grid item xs={8} sx={{ height: '100%' }}>
          <EmailDetail email={selectedEmail} />
        </Grid>
      </Grid>

      {/* Floating Action Button for Compose */}
      <Fab
        color="primary"
        aria-label="compose"
        onClick={handleComposeOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <EditIcon />
      </Fab>

      {/* Compose Email Modal */}
      <ComposeModal
        open={composeOpen}
        loading={composing}
        onClose={handleComposeClose}
        onSend={handleComposeSend}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={hideNotification}
      />
    </Box>
  );
}
