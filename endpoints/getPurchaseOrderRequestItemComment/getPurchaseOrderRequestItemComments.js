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

const getPurchaseOrderRequestItems = async (purchaseOrderRequestItemId) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderRequestItems = await knexInstance.select("*").from("purchase_order_request_item_comment").where('purchase_order_request_item_id', purchaseOrderRequestItemId);
    return {
      statusCode: 200,
      body: JSON.stringify(getAllPurchaseOrderRequestItems),
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export default getPurchaseOrderRequestItems;
