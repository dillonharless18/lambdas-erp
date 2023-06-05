import postPurchaseOrderComments from './postPurchaseOrderComments.js';

const handler = async (event) => {
  try {
    const comments = JSON.parse(event.body).comments
    const purchaseOrderId =
      event.pathParameters?.purchase_order_id;
    return await postPurchaseOrderComments(comments, purchaseOrderId)
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
