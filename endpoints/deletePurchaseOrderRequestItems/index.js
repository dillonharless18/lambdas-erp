import deletePurchaseOrderRequestItems from './deletePurchaseOrderRequestItem.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    return await deletePurchaseOrderRequestItems(body);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
