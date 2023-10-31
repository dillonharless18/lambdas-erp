import postVehicleType from './postVehicleType.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).vehicleType;
    const userSub = event.requestContext.authorizer.sub;

    return await postVehicleType(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
