const Knex = require('knex');
const config = require('./knexfile');

// Retrieve the database credentials from the environment variable
const databaseCredentials = JSON.parse(process.env.DB_CREDENTIALS);

// Set the environment (you can set it based on a NODE_ENV variable or use a specific config)
const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

// Set the user and password in the knex config
knexConfig.connection.user = databaseCredentials.user;
knexConfig.connection.password = databaseCredentials.password;

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
