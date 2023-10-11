import postPurchaseOrderComment from './postPurchaseOrderComment.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    const purchaseOrderId = event.pathParameters?.purchase_order_id;
    const userSub = event.requestContext.authorizer.sub;

    return await postPurchaseOrderComment(comment, purchaseOrderId, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
