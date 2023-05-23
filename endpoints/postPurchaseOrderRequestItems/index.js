import postPurchaseOrderRequestItems from "./postPurchaseOrderRequestItems.js";

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItems;

    return await postPurchaseOrderRequestItems(body);
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
