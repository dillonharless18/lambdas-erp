import deleteTransportationTrip from './deleteTransportationTrip.js';

const handler = async (event) => {
  try {
    const transportationTripId = event.pathParameters?.transportation_trip_id;
    if (!transportationTripId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing transportation_trip_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return await deleteTransportationTrip(transportationTripId);
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
