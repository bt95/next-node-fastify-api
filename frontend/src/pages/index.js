import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

// Debounce hook for search functionality
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Compose email state
  const [composeOpen, setComposeOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [composeForm, setComposeForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Debounce search term by 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch emails from backend
  const fetchEmails = useCallback(async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const url = search 
        ? `http://localhost:3001/api/emails?search=${encodeURIComponent(search)}`
        : 'http://localhost:3001/api/emails';
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setEmails(result.data);
        // Clear selected email if it's not in the filtered results
        if (selectedEmail && !result.data.find(email => email.id === selectedEmail.id)) {
          setSelectedEmail(null);
        }
      } else {
        setError(result.error || 'Failed to fetch emails');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedEmail]);

  // Fetch emails on component mount and when search term changes
  useEffect(() => {
    fetchEmails(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchEmails]);

  // Handle email selection
  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Truncate text for preview
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Compose email handlers
  const handleComposeOpen = () => {
    setComposeOpen(true);
  };

  const handleComposeClose = () => {
    setComposeOpen(false);
    setComposeForm({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: ''
    });
  };

  const handleComposeChange = (field) => (event) => {
    setComposeForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleComposeSend = async () => {
    if (!composeForm.to.trim() || !composeForm.subject.trim()) {
      setSnackbar({
        open: true,
        message: 'To and Subject fields are required',
        severity: 'error'
      });
      return;
    }

    setComposing(true);
    try {
      const response = await fetch('http://localhost:3001/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(composeForm),
      });

      const result = await response.json();

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Email saved successfully!',
          severity: 'success'
        });
        handleComposeClose();
        // Refresh emails list
        fetchEmails(debouncedSearchTerm);
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'Failed to save email',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to connect to server',
        severity: 'error'
      });
      console.error('Error saving email:', err);
    } finally {
      setComposing(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Grid container sx={{ flex: 1, height: '100%' }}>
        {/* Sidebar */}
        <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}>
          <Paper sx={{ height: '100%', borderRadius: 0 }}>
            {/* Search Bar */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Email List */}
            <Box sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && (
                <Box sx={{ p: 2 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}
              
              {!loading && !error && emails.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <EmailIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'No emails found matching your search' : 'No emails yet'}
                  </Typography>
                </Box>
              )}
              
              {!loading && !error && emails.length > 0 && (
                <List sx={{ p: 0 }}>
                  {emails.map((email, index) => (
                    <div key={email.id}>
                      <ListItem
                        button
                        selected={selectedEmail?.id === email.id}
                        onClick={() => handleEmailSelect(email)}
                        sx={{
                          py: 2,
                          px: 2,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" noWrap>
                              {email.subject || '(No Subject)'}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                To: {truncateText(email.to, 30)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(email.created_at)}
                              </Typography>
                              {email.body && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {truncateText(email.body, 60)}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {index < emails.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Email Detail View */}
        <Grid item xs={8} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%', borderRadius: 0 }}>
            {selectedEmail ? (
              <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                {/* Email Header */}
                <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h5" gutterBottom>
                    {selectedEmail.subject || '(No Subject)'}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>To:</strong> {selectedEmail.to}
                    </Typography>
                    {selectedEmail.cc && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>CC:</strong> {selectedEmail.cc}
                      </Typography>
                    )}
                    {selectedEmail.bcc && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>BCC:</strong> {selectedEmail.bcc}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <strong>Date:</strong> {formatDate(selectedEmail.created_at)}
                    </Typography>
                  </Box>
                </Box>

                {/* Email Body */}
                <Box>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {selectedEmail.body || '(No content)'}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <EmailIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select an email to view
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose an email from the sidebar to see its contents
                </Typography>
              </Box>
            )}
          </Paper>
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

      {/* Compose Email Dialog */}
      <Dialog
        open={composeOpen}
        onClose={handleComposeClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '600px' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon />
            <Typography variant="h6">Compose Email</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* To Field */}
            <TextField
              fullWidth
              label="To *"
              value={composeForm.to}
              onChange={handleComposeChange('to')}
              placeholder="recipient@example.com"
              variant="outlined"
            />
            
            {/* CC Field */}
            <TextField
              fullWidth
              label="CC"
              value={composeForm.cc}
              onChange={handleComposeChange('cc')}
              placeholder="cc@example.com"
              variant="outlined"
            />
            
            {/* BCC Field */}
            <TextField
              fullWidth
              label="BCC"
              value={composeForm.bcc}
              onChange={handleComposeChange('bcc')}
              placeholder="bcc@example.com"
              variant="outlined"
            />
            
            {/* Subject Field */}
            <TextField
              fullWidth
              label="Subject *"
              value={composeForm.subject}
              onChange={handleComposeChange('subject')}
              placeholder="Email subject"
              variant="outlined"
            />
            
            {/* Body Field */}
            <TextField
              fullWidth
              label="Body"
              value={composeForm.body}
              onChange={handleComposeChange('body')}
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
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleComposeClose}
            variant="outlined"
            disabled={composing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleComposeSend}
            variant="contained"
            startIcon={composing ? <CircularProgress size={16} /> : <SendIcon />}
            disabled={composing || !composeForm.to.trim() || !composeForm.subject.trim()}
          >
            {composing ? 'Saving...' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
