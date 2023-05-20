import postPurchaseOrderItems from "./postPurchaseOrderItem.js";

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItems;

    return await postPurchaseOrderItems(body);
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
