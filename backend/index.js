// ESM
import Fastify from 'fastify';

// Import plugins
import databasePlugin from './plugins/database.js';
import corsPlugin from './plugins/cors.js';

// Import route plugins
import healthRoutes from './routes/health.js';
import emailRoutes from './routes/emails.js';

/**
 * Create Fastify instance with proper configuration
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined
  },
  disableRequestLogging: process.env.NODE_ENV === 'production'
});

/**
 * Register plugins in the correct order
 * 1. Infrastructure plugins (database, cors)
 * 2. Route plugins
 */
async function buildServer() {
  try {
    // Register infrastructure plugins first
    await fastify.register(databasePlugin);
    await fastify.register(corsPlugin);
    
    // Register route plugins
    await fastify.register(healthRoutes);
    await fastify.register(emailRoutes);
    
    fastify.log.info('All plugins registered successfully');
    
  } catch (error) {
    fastify.log.error('Error registering plugins:', error);
    process.exit(1);
  }
}

/**
 * Start the server
 */
async function start() {
  try {
    await buildServer();
    
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    const address = await fastify.listen({ 
      port: parseInt(port), 
      host 
    });
    
    fastify.log.info(`Server listening on ${address}`);
    
  } catch (error) {
    fastify.log.error('Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  fastify.log.info('Received SIGINT, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  fastify.log.info('Received SIGTERM, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

// Start the server
start();
