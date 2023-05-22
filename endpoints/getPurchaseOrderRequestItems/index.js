import getPurchaseOrderRequestItems from "./getPurchaseOrderRequestItems.js";

const handler = async (event, context) => {
  try {
    const purchase_order_request_item_status_id =
      event.pathParameters?.purchase_order_request_item_status_id;
    if (!purchase_order_request_item_status_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing purchase_order_request_item_status_id path parameter",
        }),
      };
    }
    return await getPurchaseOrderRequestItems(
      purchase_order_request_item_status_id
    );
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
