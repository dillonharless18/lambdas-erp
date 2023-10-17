import getDriverTransportationTrips from './getDriverTransportationTrips.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const cognitoSub = event.requestContext.authorizer.sub;
    return await getDriverTransportationTrips(cognitoSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
