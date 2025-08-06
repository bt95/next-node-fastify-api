/**
 * Health check routes plugin
 * Provides endpoints for monitoring application health
 * 
 * @param {import('fastify').FastifyInstance} fastify
 * @param {Object} options
 */
async function healthRoutes(fastify, options) {
  // Simple health check endpoint
  fastify.get('/ping', {
    schema: {
      response: {
        200: {
          type: 'string'
        }
      }
    }
  }, async (request, reply) => {
    return 'pong\n';
  });

  // Detailed health check with database connectivity
  fastify.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' },
            database: { type: 'string' },
            version: { type: 'string' }
          }
        },
        503: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      // Test database connection
      await fastify.db.raw('SELECT 1');
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
        version: process.env.npm_package_version || '1.0.0'
      };
    } catch (error) {
      fastify.log.error('Health check failed:', error);
      
      reply.status(503).send({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      });
    }
  });
}

export default healthRoutes;
