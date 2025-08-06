import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

/**
 * ComposeModal Component
 * Modal dialog for composing new emails
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {boolean} props.loading - Whether the form is submitting
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onSend - Callback when email is sent
 */
export default function ComposeModal({ open, loading, onClose, onSend }) {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });

  // Handle form field changes
  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const success = await onSend(formData);
    if (success) {
      handleClose();
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: ''
    });
    onClose();
  };

  // Check if form is valid
  const isFormValid = formData.to.trim() && formData.subject.trim();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <ComposeHeader />
      </DialogTitle>
      
      <DialogContent>
        <ComposeForm
          formData={formData}
          onChange={handleChange}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <ComposeActions
          loading={loading}
          isFormValid={isFormValid}
          onCancel={handleClose}
          onSend={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
}

/**
 * ComposeHeader Component
 * Header section of the compose modal
 */
function ComposeHeader() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <EditIcon />
      <Typography variant="h6">Compose Email</Typography>
    </Box>
  );
}

/**
 * ComposeForm Component
 * Form fields for email composition
 */
function ComposeForm({ formData, onChange }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      {/* To Field */}
      <TextField
        fullWidth
        label="To *"
        value={formData.to}
        onChange={onChange('to')}
        placeholder="recipient@example.com"
        variant="outlined"
        required
      />
      
      {/* CC Field */}
      <TextField
        fullWidth
        label="CC"
        value={formData.cc}
        onChange={onChange('cc')}
        placeholder="cc@example.com"
        variant="outlined"
      />
      
      {/* BCC Field */}
      <TextField
        fullWidth
        label="BCC"
        value={formData.bcc}
        onChange={onChange('bcc')}
        placeholder="bcc@example.com"
        variant="outlined"
      />
      
      {/* Subject Field */}
      <TextField
        fullWidth
        label="Subject *"
        value={formData.subject}
        onChange={onChange('subject')}
        placeholder="Email subject"
        variant="outlined"
        required
      />
      
      {/* Body Field */}
      <TextField
        fullWidth
        label="Body"
        value={formData.body}
        onChange={onChange('body')}
        placeholder="Write your email here..."
        variant="outlined"
        multiline
        rows={12}
        sx={{
          '& .MuiInputBase-root': {
            alignItems: 'flex-start',
          },
        }}
      />
    </Box>
  );
}

/**
 * ComposeActions Component
 * Action buttons for the compose modal
 */
function ComposeActions({ loading, isFormValid, onCancel, onSend }) {
  return (
    <>
      <Button
        onClick={onCancel}
        variant="outlined"
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        onClick={onSend}
        variant="contained"
        startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
        disabled={loading || !isFormValid}
      >
        {loading ? 'Saving...' : 'Send'}
      </Button>
    </>
  );
}
