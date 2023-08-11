import getOcrImportedPurhaseOrders from './getOcrImportedPurchaseOrders.js';

const handler = async (event) => {
  try {
    const userSub = queryParams.userSub;
    
    return await getOcrImportedPurhaseOrders(userSub);
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
