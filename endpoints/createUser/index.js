import createUser from './createUser.js';

const handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body).userData;
    const userSub = event.requestContext.authorizer.sub;

    return await createUser(body, userSub);
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