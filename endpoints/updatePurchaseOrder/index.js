import updatePurchaseOrder from './updatePurchaseOrder.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).purchaseOrder;
    const purchaseOrderId = event.pathParameters?.purchase_order_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updatePurchaseOrder(body, purchaseOrderId, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
