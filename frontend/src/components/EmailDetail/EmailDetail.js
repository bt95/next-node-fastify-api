import {
  Box,
  Paper,
  Typography
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { formatDate, formatRecipients } from '../../utils/formatters';

/**
 * EmailDetail Component
 * Displays the selected email's full content
 * 
 * @param {Object} props - Component props
 * @param {Object} props.email - Selected email object
 */
export default function EmailDetail({ email }) {
  if (!email) {
    return <EmptyDetailView />;
  }

  const recipients = formatRecipients(email.to, email.cc, email.bcc);

  return (
    <Paper 
      elevation={8}
      sx={{ 
        height: '100%', 
        borderRadius: '0 20px 20px 0',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 4, height: '100%', overflow: 'auto' }}>
        {/* Email Header */}
        <EmailHeader email={email} recipients={recipients} />
        
        {/* Email Body */}
        <EmailBody body={email.body} />
      </Box>
    </Paper>
  );
}

/**
 * EmptyDetailView Component
 * Displays when no email is selected
 */
function EmptyDetailView() {
  return (
    <Paper 
      elevation={8}
      sx={{ 
        height: '100%', 
        borderRadius: '0 20px 20px 0',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden'
      }}
    >
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
    </Paper>
  );
}

/**
 * EmailHeader Component
 * Displays email metadata (subject, recipients, date)
 */
function EmailHeader({ email, recipients }) {
  return (
    <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="h5" gutterBottom>
        {email.subject || '(No Subject)'}
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <RecipientField label="To" value={recipients.to} />
        {recipients.hasCC && (
          <RecipientField label="CC" value={recipients.cc} />
        )}
        {recipients.hasBCC && (
          <RecipientField label="BCC" value={recipients.bcc} />
        )}
        <RecipientField label="Date" value={formatDate(email.created_at)} />
      </Box>
    </Box>
  );
}

/**
 * RecipientField Component
 * Displays a single recipient field
 */
function RecipientField({ label, value }) {
  return (
    <Typography variant="body2" color="text.secondary">
      <strong>{label}:</strong> {value}
    </Typography>
  );
}

/**
 * EmailBody Component
 * Displays the email body content
 */
function EmailBody({ body }) {
  return (
    <Box>
      <Typography 
        variant="body1" 
        sx={{ 
          whiteSpace: 'pre-wrap', 
          lineHeight: 1.6,
          wordBreak: 'break-word'
        }}
      >
        {body || '(No content)'}
      </Typography>
    </Box>
  );
}
