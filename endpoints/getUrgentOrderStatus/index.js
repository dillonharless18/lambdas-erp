import getUrgentOrderStatus from './getUrgentOrderStatus.js';

const handler = async () => {
  try {
    return await getUrgentOrderStatus();
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
