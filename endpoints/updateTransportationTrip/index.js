import updateTransportationTrip from './updateTransportationTrip.js';

const handler = async (event) => {
  try {
    const transportationTripId = event.pathParameters?.transportation_trip_id;
    const body = JSON.parse(event.body).transportationTrip;
    const userSub = event.requestContext.authorizer.sub;

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

    return await updateTransportationTrip(body, transportationTripId, userSub);
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
