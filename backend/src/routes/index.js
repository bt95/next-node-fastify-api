import DB from '../db/index.js';

export default async function routes(fastify, options) {
  // Enable CORS for frontend communication
  await fastify.register(import('@fastify/cors'), {
    origin: ['http://localhost:3000'],
    credentials: true
  });

  // Health check endpoint
  fastify.get('/ping', async (request, reply) => {
    return 'pong\n';
  });

  // Get all emails with optional search
  fastify.get('/api/emails', async (request, reply) => {
    try {
      const { search } = request.query;
      const emails = await DB.getEmails(search);
      return { success: true, data: emails };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ success: false, error: 'Failed to fetch emails' });
    }
  });

  // Get single email by ID
  fastify.get('/api/emails/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const email = await DB.getEmailById(id);
      
      if (!email) {
        reply.status(404).send({ success: false, error: 'Email not found' });
        return;
      }
      
      return { success: true, data: email };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ success: false, error: 'Failed to fetch email' });
    }
  });

  // Create new email
  fastify.post('/api/emails', async (request, reply) => {
    try {
      const { to, cc, bcc, subject, body } = request.body;
      
      // Basic validation
      if (!to || !subject) {
        reply.status(400).send({ 
          success: false, 
          error: 'To and subject fields are required' 
        });
        return;
      }
      
      const emailData = {
        to: to || '',
        cc: cc || '',
        bcc: bcc || '',
        subject,
        body: body || ''
      };
      
      const result = await DB.createEmail(emailData);
      return { success: true, data: result };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ success: false, error: 'Failed to create email' });
    }
  });

  // Delete email
  fastify.delete('/api/emails/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await DB.deleteEmail(id);
      
      if (result === 0) {
        reply.status(404).send({ success: false, error: 'Email not found' });
        return;
      }
      
      return { success: true, message: 'Email deleted successfully' };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ success: false, error: 'Failed to delete email' });
    }
  });
}
