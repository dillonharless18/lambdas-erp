import getAllVendors from "./getAllVendors.js";

const handler = async (event, context) => {
  try {
    return await getAllVendors();
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export { handler }