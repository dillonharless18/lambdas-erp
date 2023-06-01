import getPurchaseOrderItems from './getPurchaseOrderItems.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const purchaseOrderId = queryParams.purchase_order_id;
    if (!purchaseOrderId) {
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
    return await getPurchaseOrderItems(purchaseOrderId);
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
