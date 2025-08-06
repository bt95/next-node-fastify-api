import knex from 'knex';
import knexConfig from './knexfile.js';

const db = knex(knexConfig.development);

const sampleEmails = [
  {
    to: 'john.doe@example.com',
    cc: 'manager@example.com',
    bcc: '',
    subject: 'Welcome to the team!',
    body: 'Hi John,\n\nWelcome to our amazing team! We are excited to have you on board.\n\nBest regards,\nHR Team'
  },
  {
    to: 'alice.smith@example.com',
    cc: '',
    bcc: '',
    subject: 'Project Update - Q4 Goals',
    body: 'Hi Alice,\n\nI wanted to update you on our Q4 project goals. We are making great progress on the new features.\n\nPlease let me know if you have any questions.\n\nBest,\nProject Manager'
  },
  {
    to: 'bob.wilson@example.com',
    cc: 'team@example.com',
    bcc: '',
    subject: 'Meeting Reminder - Tomorrow 2PM',
    body: 'Hi Bob,\n\nJust a quick reminder about our meeting tomorrow at 2PM in the conference room.\n\nAgenda:\n- Review current progress\n- Discuss next steps\n- Q&A session\n\nSee you there!\nMeeting Organizer'
  },
  {
    to: 'sarah.johnson@example.com',
    cc: '',
    bcc: '',
    subject: 'Invoice #12345',
    body: 'Dear Sarah,\n\nPlease find attached the invoice #12345 for the services provided last month.\n\nPayment is due within 30 days.\n\nThank you for your business!\nAccounting Department'
  },
  {
    to: 'mike.brown@example.com',
    cc: 'support@example.com',
    bcc: '',
    subject: 'Technical Support Request',
    body: 'Hi Mike,\n\nWe received your technical support request regarding the login issues.\n\nOur team is working on it and will get back to you within 24 hours.\n\nBest regards,\nTech Support'
  }
];

async function seedData() {
  try {
    console.log('Adding sample emails...');
    
    // Clear existing emails
    await db('emails').del();
    
    // Insert sample emails
    await db('emails').insert(sampleEmails);
    
    console.log(`Successfully added ${sampleEmails.length} sample emails!`);
    
    // Verify the data
    const count = await db('emails').count('id as count').first();
    console.log(`Total emails in database: ${count.count}`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await db.destroy();
  }
}

seedData();
