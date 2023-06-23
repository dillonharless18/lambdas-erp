import getTransportationTrips from './getTransportationTrips.js';

const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters;
    const transportationTripStatus = queryParams ? queryParams.status : null;

    return await getTransportationTrips(transportationTripStatus);
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
