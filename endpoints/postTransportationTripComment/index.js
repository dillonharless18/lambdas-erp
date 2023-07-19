import postTransportationTripComment from './postTransportationTripComment.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    const transportationTripId = event.pathParameters?.transportation_trip_id;
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

    return await postTransportationTripComment(
      comment,
      transportationTripId,
      userSub
    );
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
