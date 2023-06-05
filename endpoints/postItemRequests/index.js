import postItemRequests from './postItemRequests';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItems;

    return await postItemRequests(body);
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