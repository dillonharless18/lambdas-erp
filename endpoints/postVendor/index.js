import postVendor from './postVendor.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).vendorData;
    const userSub = event.requestContext.authorizer.sub;

    return await postVendor(body, userSub);
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