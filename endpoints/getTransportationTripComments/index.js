import getTransportationTripComments from './getTransportationTripComments.js';

const handler = async (event, context) => {
  try {
    const transportationTripId = event.pathParameters?.transportaion_trip_id;
    if (!transportationTripId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            'Missing transportaion_trip_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return await getTransportationTripComments(transportationTripId);
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
