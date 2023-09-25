import getOcrImportedPurhaseOrders from './getOcrImportedPurchaseOrders.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const userSub = queryParams ? queryParams.userSub : null;

    return await getOcrImportedPurhaseOrders(userSub);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
