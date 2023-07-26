import postVehicleType from './postVehicleType.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).vehicleType;
    const userSub = event.requestContext.authorizer.sub;

    return await postVehicleType(body, userSub);
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
