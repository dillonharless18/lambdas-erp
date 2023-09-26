import updatePurchaseOrderRequestItem from './updatePurchaseOrderRequestItem.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItem;
    const purchaseOrderRequestItemId =
      event.pathParameters?.purchase_order_request_item_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updatePurchaseOrderRequestItem(
      body,
      purchaseOrderRequestItemId,
      userSub
    );
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
