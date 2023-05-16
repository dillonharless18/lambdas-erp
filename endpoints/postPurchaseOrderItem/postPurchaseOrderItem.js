const PurchaseOrderItem = require("./DTO/PurchaseOrderItem");
import initializeKnex from "/opt/nodejs/db/index.js";

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

module.exports.postPurchaseOrderItems = async (items) => {
  await initializeDb();

  if (!Array.isArray(items)) {
    throw new Error("The items parameter must be an array");
  }

  const purchaseOrderItems = items.map((item) => new PurchaseOrderItem(item));

  const dataToInsert = purchaseOrderItems.map((item) => ({
    purchase_order_request_id: item.purchase_order_request_id,
    quantity: item.quantity,
    item_name: item.item_name,
    unit_of_measurement: item.unit_of_measurement,
    suggested_vendor: item.suggested_vendor,
    urgent_order_status: item.urgent_order_status,
    project_id: item.project_id,
    description: item.description,
    s3_uri: item.s3_uri,
    user_id: item.user_id,
    created_at: item.created_at,
    purchase_order_request_item_status_id:
      item.purchase_order_request_item_status_id,
  }));

  try {
    await knexInstance("purchase_order_items").insert(dataToInsert);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Purchase Order Items added successfully!",
      }),
    };
  } catch (error) {
    console.error("Error in postPurchaseOrderItems:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};
