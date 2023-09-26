import postPurchaseOrder from './postPurchaseOrder.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).purchaseOrder;
    const userSub = event.requestContext.authorizer.sub;

    return await postPurchaseOrder(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
