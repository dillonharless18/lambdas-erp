import getPurchaseOrderItems from './getPurchaseOrderItems.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const purchase_order_id = queryParams.purchase_order_id;
    if (!purchase_order_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing purchase_order_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return await getPurchaseOrderItems(purchase_order_id);
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
