import getAllUsers from './getAllUsers.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const userRole = queryParams.role;
    if (!userRole) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing role path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return await getAllUsers(userRole);
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export { handler };
