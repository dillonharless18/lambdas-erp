import getDriverTransportationTrips from './getDriverTransportationTrips.js';

const handler = async (event) => {
  try {
    const driverId = event.pathParameters?.driver_id;
    return await getDriverTransportationTrips(driverId);

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
