import updatePurchaseOrder from './updatePurchaseOrder.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).purchaseOrder;
    const purchaseOrderId = event.pathParameters?.purchase_order_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updatePurchaseOrder(body, purchaseOrderId, userSub);
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
