import getTransportationTrips from './getTransportationTrips.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const transportationTripStatus = queryParams ? queryParams.status : null;
    const isAll = queryParams?.isAll ?? null

    return await getTransportationTrips(transportationTripStatus, isAll);
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export { handler };
