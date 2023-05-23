import getPurchaseOrderRequestItems from "./getPurchaseOrderRequestItems.js";

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const status = queryParams.status;
    if (!status) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing status path parameter",
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return await getPurchaseOrderRequestItems(status);
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
