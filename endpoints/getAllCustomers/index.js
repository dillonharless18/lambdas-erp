import getAllCustomers from './getAllCustomers.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const isAll = queryParams?.isAll
    return await getAllCustomers(isAll);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
