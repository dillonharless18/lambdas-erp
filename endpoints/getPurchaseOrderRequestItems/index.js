import getPurchaseOrderRequestItems from "./getPurchaseOrderRequestItems.js";

const handler = async (event, context) => {
  try {
    return await getPurchaseOrderRequestItems();
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
