import postTransportationTrip from './postTransportationTrip.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).transportationTrip;
    const userSub = event.requestContext.authorizer.sub;

    return await postTransportationTrip(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
