const knex = require("knex");
const knexConfig = require("./knexfile");

const initializeKnex = async () => {
  try {
    const config = await knexConfig();
    return knex(config);
  } catch (error) {
    console.error("Error initializing knex:", error);
    throw error;
  }
};

module.exports = initializeKnex;
