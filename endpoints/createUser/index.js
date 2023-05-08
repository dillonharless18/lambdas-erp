const initializeKnex = require("./db");
const uuid = require("uuid");

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

const formatUserData = (userDataFromLambdaEvent) => {
  return {
    user_id: uuid.v4(),
    ...userDataFromLambdaEvent,
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
  };
};

/**
/**
 * Creates a new user in the PostgreSQL database.
 *
 * @function
 * @async
 * @param   {Object}  event - The Lambda event object
 * @param   {Object}  context - The Lambda context object
 * @param   {string}  event.body - A JSON formatted string containing the user information
 * @param   {boolean} event.body.is_active - Whether the user is active or not
 * @param   {string}  event.body.first_name - The user's first name (1-20 characters)
 * @param   {string}  event.body.last_name - The user's last name (1-20 characters)
 * @param   {string}  event.body.phone_number - The user's phone number (1-15 characters)
 * @param   {string}  event.body.ocr_tool_id - The OCR tool ID associated with the user (1-45 characters)
 * @param   {string}  event.body.user_role - The user's role (1-20 characters)
 * @param   {string}  event.body.user_email - The user's email address (1-45 characters)
 * @returns {Object}  response - The Lambda response object
 * @returns {number}  response.statusCode - The HTTP status code (201 for success)
 * @returns {string}  response.body - A JSON-formatted string containing the created user information
 * @throws  {Error}   If an error occurs while interacting with the database
 */
exports.handler = async function (event, context) {
  try {
    await initializeDb();
    const userData = JSON.parse(event.body);
    const newUser = formatUserData(userData);
    const userTable = await knexInstance("user").insert(newUser);

    return {
      statusCode: 201,
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
