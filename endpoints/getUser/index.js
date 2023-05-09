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

/**
 * GETS a user from the PostgreSQL database.
 *
 * @function
 * @async
 * @param   {Object}  event - The Lambda event object
 * @param   {Object}  context - The Lambda context object
 * @param   {Object}  event.pathParameters - An object containing the path parameters
 * @param   {string}  event.pathParameters.user_id - The user_id of the user to be retrieved
 * @returns {Object}  response - The Lambda response object
 * @returns {number}  response.statusCode - The HTTP status code (201 for success)
 * @returns {string}  response.body - A JSON-formatted string containing the created user information
 * @throws  {Error}   If an error occurs while interacting with the database
 */
exports.handler = async function (event, context) {
  try {
    await initializeDb();
    const userId = event.pathParameters.user_id;
    const user = await knexInstance("user")
      .select("*")
      .where("user_id", userId);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
