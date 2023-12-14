import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import deleteOcrImportedPurchaseOrderItems from './deleteOcrImportedPurchaseOrderItems.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const userSub = event.requestContext.authorizer.sub;

    return await deleteOcrImportedPurchaseOrderItems(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};
