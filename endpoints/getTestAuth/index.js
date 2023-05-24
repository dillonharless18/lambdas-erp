import initializeKnex from "/opt/nodejs/db/index.js";

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

const validatePathParameters = (pathParameters) => {
  if (
    !pathParameters ||
    !pathParameters.hasOwnProperty("user_id") ||
    pathParameters.user_id.trim() === ""
  ) {
    return false;
  }
  return true;
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
export const handler = async function (event, context) {
  try {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`)
    console.log(`Context: ${JSON.stringify(context, null, 2)}`)
    await initializeDb();

    return {
      statusCode: 200,
      body: JSON.stringify("Test successful"),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
