import updatePurchaseOrderItems from './updatePurchaseOrderItems.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).purchaseOrderItems;
    const userSub = event.requestContext.authorizer.sub;

    return await updatePurchaseOrderItems(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
