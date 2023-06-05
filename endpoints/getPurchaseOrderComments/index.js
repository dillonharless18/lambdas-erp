import getPurchaseOrderComments from './getPurchaseOrderComments.js';

const handler = async (event, context) => {
  try {
    const purchaseOrderId =
      event.pathParameters?.purchase_order_id;
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
    return await getPurchaseOrderComments(
      purchaseOrderId
    );
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
