import initializeKnex from '/opt/nodejs/db/index.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const getUserByCognitoSub = async (cognitoSub) => {
  if (!cognitoSub) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: No cognito_sub provided',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  await initializeDb();
  try {
    const loggedInUser = await knexInstance('user')
      .select('*')
      .where('cognito_sub', cognitoSub)

    return {
      statusCode: 200,
      body: JSON.stringify(loggedInUser),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching User data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Server Error, ${error}`,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getUserByCognitoSub;
