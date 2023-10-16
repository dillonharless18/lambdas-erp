import getTransportationTrips from './getTransportationTrips.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const transportationTripStatus = queryParams ? queryParams.status : null;
    const isAll = queryParams?.isAll ?? null;

    return await getTransportationTrips(transportationTripStatus, isAll);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
