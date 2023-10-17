import updateTransportationTrip from './updateTransportationTrip.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const transportationTripId = event.pathParameters?.transportation_trip_id;
    const body = JSON.parse(event.body).transportationTrip;
    const userSub = event.requestContext.authorizer.sub;

    if (!transportationTripId) {
      throw new BadRequestError(
        'Missing transportation_trip_id path parameter'
      );
    }

    return await updateTransportationTrip(body, transportationTripId, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
