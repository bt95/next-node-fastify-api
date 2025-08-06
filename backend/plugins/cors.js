import fp from 'fastify-plugin';

/**
 * CORS configuration plugin
 * Configures Cross-Origin Resource Sharing for the application
 * 
 * @param {import('fastify').FastifyInstance} fastify
 * @param {Object} options
 */
async function corsPlugin(fastify, options) {
  // Register CORS with configuration
  await fastify.register(import('@fastify/cors'), {
    origin: [
      'http://localhost:3000',  // Frontend development server
      'http://127.0.0.1:3000'   // Alternative localhost
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  fastify.log.info('CORS plugin registered successfully');
}

// Export as a Fastify plugin
export default fp(corsPlugin, {
  name: 'cors',
  dependencies: []
});
