import getPurchaseOrderRequestItems from './getPurchaseOrderRequestItems.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { NotFoundError } from '/opt/nodejs/errors.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const status = queryParams.status;
    const userSub = queryParams.userSub;
    if (!status) {
      throw new NotFoundError('Missing status path parameter');
    }
    return await getPurchaseOrderRequestItems(status, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
