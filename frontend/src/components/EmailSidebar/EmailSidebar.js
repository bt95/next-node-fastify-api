import {
  Box,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import { truncateText, formatDate } from '../../utils/formatters';

/**
 * EmailSidebar Component
 * Displays the email list with search functionality
 * 
 * @param {Object} props - Component props
 * @param {Array} props.emails - Array of emails to display
 * @param {Object} props.selectedEmail - Currently selected email
 * @param {string} props.searchTerm - Current search term
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message if any
 * @param {Function} props.onEmailSelect - Callback when email is selected
 * @param {Function} props.onSearchChange - Callback when search term changes
 */
export default function EmailSidebar({
  emails,
  selectedEmail,
  searchTerm,
  loading,
  error,
  onEmailSelect,
  onSearchChange
}) {
  return (
    <Paper sx={{ height: '100%', borderRadius: 0 }}>
      {/* Search Bar */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
          <EmptyState searchTerm={searchTerm} />
        )}
        
        {!loading && !error && emails.length > 0 && (
          <EmailList
            emails={emails}
            selectedEmail={selectedEmail}
            onEmailSelect={onEmailSelect}
          />
        )}
      </Box>
    </Paper>
  );
}

/**
 * EmptyState Component
 * Displays when no emails are found
 */
function EmptyState({ searchTerm }) {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <EmailIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {searchTerm ? 'No emails found matching your search' : 'No emails yet'}
      </Typography>
    </Box>
  );
}

/**
 * EmailList Component
 * Renders the list of emails
 */
function EmailList({ emails, selectedEmail, onEmailSelect }) {
  return (
    <List sx={{ p: 0 }}>
      {emails.map((email, index) => (
        <EmailListItem
          key={email.id}
          email={email}
          isSelected={selectedEmail?.id === email.id}
          onSelect={() => onEmailSelect(email)}
          showDivider={index < emails.length - 1}
        />
      ))}
    </List>
  );
}

/**
 * EmailListItem Component
 * Individual email item in the list
 */
function EmailListItem({ email, isSelected, onSelect, showDivider }) {
  return (
    <>
      <ListItem
        button
        selected={isSelected}
        onClick={onSelect}
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
      {showDivider && <Divider />}
    </>
  );
}
