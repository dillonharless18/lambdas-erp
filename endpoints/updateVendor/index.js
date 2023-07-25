import updateVendor from './updateVendor.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).vendorData;
    const vendorId = event.pathParameters?.vendor_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updateVendor(body, vendorId, userSub);
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
