const initializeKnex = require("./db");

let knexInstance;
const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    throw error;
  }
};

exports.handler = async function (event, context) {
  try {
    await initializeDb();
    return {
      statusCode: 201,
      body: JSON.stringify("successfully created user"),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
