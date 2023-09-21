import postPurchaseOrderRequestItemComment from './postPurchaseOrderRequestItemComment.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

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
    return createErrorResponse(error);
  }
};

export { handler };
