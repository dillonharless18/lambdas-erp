import getAllVehicleType from './getAllVehicleType.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const isAll = queryParams?.isAll;
    return await getAllVehicleType(isAll);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
