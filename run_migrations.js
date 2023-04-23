const Knex = require('knex');
const config = require('./knexfile');

// Set the environment (you can set it based on a NODE_ENV variable or use a specific config)
const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

// Initialize the Knex instance
const knex = Knex(knexConfig);

// Run migrations
knex.migrate.latest()
  .then(() => {
    console.log('Migrations successfully executed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error executing migrations:', error);
    process.exit(1);
  });
