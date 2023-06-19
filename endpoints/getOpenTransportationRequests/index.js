import getOpenTransportationRequests from './getOpenTransportationRequests.js';

const handler = async (event) => {
  try {
    return await getOpenTransportationRequests();
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
