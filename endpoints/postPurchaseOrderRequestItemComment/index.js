import postPurchaseOrderRequestItemComment from './postPurchaseOrderRequestItemComment.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    const purchaseOrderRequestItemId =
      event.pathParameters?.purchase_order_request_item_id;
    const userSub = event.requestContext.authorizer.sub;

    return await postPurchaseOrderRequestItemComment(
      comment,
      purchaseOrderRequestItemId,
      userSub
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
