const initializeKnex = require("/opt/nodejs/db/index.js");

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

module.exports.getAllProjects = async () => {
  await initializeDb();
  try {
    const projects = await knexInstance.select("*").from("project");
    return {
      statusCode: 200,
      body: JSON.stringify(projects),
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};
