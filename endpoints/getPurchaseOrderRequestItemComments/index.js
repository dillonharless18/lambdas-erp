import getPurchaseOrderRequestItemsComments from './getPurchaseOrderRequestItemComments.js';

const handler = async (event, context) => {
  try {
    const purchaseOrderRequestItemId =
      event.pathParameters?.purchase_order_request_item_id;
    if (!purchaseOrderRequestItemId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing purchase_order_request_item_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return await getPurchaseOrderRequestItemsComments(
      purchaseOrderRequestItemId
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
