import fp from 'fastify-plugin';
import knex from 'knex';
import knexConfig from '../knexfile.js';

/**
 * Database connection plugin
 * This plugin creates a database connection and decorates the Fastify instance
 * with a 'db' property that can be used throughout the application.
 * 
 * @param {import('fastify').FastifyInstance} fastify
 * @param {Object} options
 */
async function databasePlugin(fastify, options) {
  // Create database connection
  const db = knex(knexConfig.development);
  
  // Test the connection
  try {
    await db.raw('SELECT 1');
    fastify.log.info('Database connection established successfully');
  } catch (error) {
    fastify.log.error('Failed to connect to database:', error);
    throw error;
  }
  
  // Decorate Fastify instance with database connection
  fastify.decorate('db', db);
  
  // Add graceful shutdown
  fastify.addHook('onClose', async (instance) => {
    await instance.db.destroy();
    fastify.log.info('Database connection closed');
  });
}

// Export as a Fastify plugin
// fastify-plugin is needed to expose the 'db' decorator to the parent scope
export default fp(databasePlugin, {
  name: 'database',
  dependencies: []
});
