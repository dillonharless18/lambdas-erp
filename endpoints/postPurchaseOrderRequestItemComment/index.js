import postPurchaseOrderRequestItemComment from './postPurchaseOrderRequestItemComment.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    const purchaseOrderRequestItemId = event.pathParameters?.purchase_order_request_item_id;

    return await postPurchaseOrderRequestItemComment(comment, purchaseOrderRequestItemId);
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
