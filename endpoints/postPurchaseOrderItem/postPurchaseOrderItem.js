// postPurchaseOrderItems.js
const knexConfig = require('./knex');
const PurchaseOrderItem = require('./DTO/PurchaseOrderItem');
const { initializeDb, getKnexInstance } = require('./db');

// Initialize DB
initializeDb();

const postPurchaseOrderItems = async (items) => {
  try {
    // Get knex instance
    const knex = getKnexInstance();

    // Map incoming items to DTOs
    const purchaseOrderItems = items.map(item => new PurchaseOrderItem(item));

    // Prepare data for insertion
    const dataToInsert = purchaseOrderItems.map(item => ({
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
      purchase_order_request_item_status_id: item.purchase_order_request_item_status_id,
    }));

    // Insert data into database
    await knex('purchase_order_items').insert(dataToInsert);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Purchase Order Items added successfully!" }),
    };
  } catch (error) {
    console.error("Error in postPurchaseOrderItems:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

module.exports = postPurchaseOrderItems;
