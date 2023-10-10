import getPurchaseOrders from './getPurchaseOrders.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const status = queryParams.status;
    if (!status) {
      throw new BadRequestError('Query param Status is missing');
    }
    return await getPurchaseOrders(status);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
