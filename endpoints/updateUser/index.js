import updateUser from './updateUser.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).userData;
    const userId = event.pathParameters?.user_id;

    return await updateUser(body, userId);
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
