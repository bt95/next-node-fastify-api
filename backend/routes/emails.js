import EmailService from '../services/email-service.js';

/**
 * Email routes plugin
 * Handles all email-related HTTP endpoints
 * 
 * @param {import('fastify').FastifyInstance} fastify
 * @param {Object} options
 */
async function emailRoutes(fastify, options) {
  // Create email service instance with database connection
  const emailService = new EmailService(fastify.db);

  // Get all emails with optional search
  fastify.get('/api/emails', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  to: { type: 'string' },
                  cc: { type: 'string' },
                  bcc: { type: 'string' },
                  subject: { type: 'string' },
                  body: { type: 'string' },
                  created_at: { type: 'string' },
                  updated_at: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { search } = request.query;
      const emails = await emailService.getEmails(search);
      return { success: true, data: emails };
    } catch (error) {
      fastify.log.error('Error fetching emails:', error);
      reply.status(500).send({ 
        success: false, 
        error: 'Failed to fetch emails' 
      });
    }
  });

  // Get single email by ID
  fastify.get('/api/emails/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                to: { type: 'string' },
                cc: { type: 'string' },
                bcc: { type: 'string' },
                subject: { type: 'string' },
                body: { type: 'string' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const email = await emailService.getEmailById(id);
      
      if (!email) {
        reply.status(404).send({ 
          success: false, 
          error: 'Email not found' 
        });
        return;
      }
      
      return { success: true, data: email };
    } catch (error) {
      fastify.log.error('Error fetching email:', error);
      reply.status(500).send({ 
        success: false, 
        error: 'Failed to fetch email' 
      });
    }
  });

  // Create new email
  fastify.post('/api/emails', {
    schema: {
      body: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          cc: { type: 'string' },
          bcc: { type: 'string' },
          subject: { type: 'string' },
          body: { type: 'string' }
        },
        required: ['to', 'subject']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                to: { type: 'string' },
                cc: { type: 'string' },
                bcc: { type: 'string' },
                subject: { type: 'string' },
                body: { type: 'string' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const emailData = request.body;
      
      // Validate email data using service layer
      const validation = emailService.validateEmailData(emailData);
      if (!validation.isValid) {
        reply.status(400).send({ 
          success: false, 
          error: validation.errors.join(', ') 
        });
        return;
      }
      
      const result = await emailService.createEmail(emailData);
      return { success: true, data: result };
    } catch (error) {
      fastify.log.error('Error creating email:', error);
      
      if (error.message.includes('required')) {
        reply.status(400).send({ 
          success: false, 
          error: error.message 
        });
      } else {
        reply.status(500).send({ 
          success: false, 
          error: 'Failed to create email' 
        });
      }
    }
  });

  // Delete email
  fastify.delete('/api/emails/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'integer' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await emailService.deleteEmail(id);
      
      if (result === 0) {
        reply.status(404).send({ 
          success: false, 
          error: 'Email not found' 
        });
        return;
      }
      
      return { 
        success: true, 
        message: 'Email deleted successfully' 
      };
    } catch (error) {
      fastify.log.error('Error deleting email:', error);
      reply.status(500).send({ 
        success: false, 
        error: 'Failed to delete email' 
      });
    }
  });
}

export default emailRoutes;
