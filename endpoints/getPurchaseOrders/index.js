import getPurchaseOrders from './getPurchaseOrders.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const status = queryParams.status;
    if (!status) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing status path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return await getPurchaseOrders(status);
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
