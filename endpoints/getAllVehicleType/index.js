import getAllVehicleType from './getAllVehicleType.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const isAll = queryParams?.isAll
    return await getAllVehicleType(isAll);
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
