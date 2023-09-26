import updatePurchaseOrderRequestItems from './updatePurchaseOrderRequestItems.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItems;
    const userSub = event.requestContext.authorizer.sub;

    return await updatePurchaseOrderRequestItems(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error.stack); // Logging error stack
    return createErrorResponse(error);
  }
};

export { handler };
