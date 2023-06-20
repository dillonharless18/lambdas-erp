import updatePurchaseOrderRequestItem from './updatePurchaseOrderRequestItem.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItem;
    const purchaseOrderRequestItemId = event.pathParameters?.purchase_order_request_item_id;

    return await updatePurchaseOrderRequestItem(body, purchaseOrderRequestItemId);
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
