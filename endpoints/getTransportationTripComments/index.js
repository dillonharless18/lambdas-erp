import getTransportationTripComments from './getTransportationTripComments.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event, context) => {
  try {
    const transportationTripId = event.pathParameters?.transportation_trip_id;
    if (!transportationTripId) {
      throw new BadRequestError('Missing transportaion_trip_id path parameter');
    }
    return await getTransportationTripComments(transportationTripId);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
