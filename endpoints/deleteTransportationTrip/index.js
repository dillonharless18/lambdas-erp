import deleteTransportationTrip from './deleteTransportationTrip.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const transportationTripId = event.pathParameters?.transportation_trip_id;
    if (!transportationTripId) {
      throw new BadRequestError(
        'Missing transportation_trip_id path parameter'
      );
    }

    return await deleteTransportationTrip(transportationTripId);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
