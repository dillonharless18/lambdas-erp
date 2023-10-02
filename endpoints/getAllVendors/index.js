import getAllVendors from './getAllVendors.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const netVendors = queryParams ? queryParams.netVendors : null;

    return await getAllVendors(netVendors);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
