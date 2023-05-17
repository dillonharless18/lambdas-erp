import getPurchaseOrderRequestItems from "./getPurchaseOrderRequestItemComments";

const handler = async (event, context) => {
  try {
    const purchaseOrderRequestItemId = event.pathParameters?.purchase_order_request_item_id;
    if (!purchaseOrderRequestItemId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing purchase_order_request_item_id path parameter' }),
      };
    }
    return await getPurchaseOrderRequestItems(purchaseOrderRequestItemId);
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
