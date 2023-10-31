import updateVehicleType from './updateVehicleType.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const vehicleTypeId = event.pathParameters?.vehicle_type_id;
    const body = JSON.parse(event.body).vehicleType;
    const userSub = event.requestContext.authorizer.sub;

    return await updateVehicleType(vehicleTypeId, body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
