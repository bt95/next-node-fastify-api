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
    <Box 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }}
      />
      <Grid container sx={{ flex: 1, height: '100%', position: 'relative', zIndex: 1 }}>
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
        aria-label="compose"
        onClick={handleComposeOpen}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          width: 64,
          height: 64,
          boxShadow: '0 8px 32px rgba(240, 147, 251, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            transform: 'translateY(-4px) scale(1.05)',
            boxShadow: '0 12px 40px rgba(240, 147, 251, 0.6)',
          },
          '&:active': {
            transform: 'translateY(-2px) scale(1.02)',
          }
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
