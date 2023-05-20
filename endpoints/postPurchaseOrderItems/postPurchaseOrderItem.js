import PurchaseOrderItem from "./DTO/PurchaseOrderItem.js";
import initializeKnex from "/opt/nodejs/db/index.js";
import { v4 as uuidv4 } from "uuid";

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

const postPurchaseOrderItems = async (items) => {
  await initializeDb();

  if (!Array.isArray(items)) {
    throw new Error("The items parameter must be an array");
  }

  const purchaseOrderItems = items.map((item) => new PurchaseOrderItem(item));

  const dataToInsert = purchaseOrderItems.map((item) => ({
    purchase_order_item_id: uuidv4(),
    purchase_order_id: item.purchase_order_id,
    created_by: "1b3ef41c-23af-4eee-bbd7-5610b38e37f2",
    last_updated_by: "1b3ef41c-23af-4eee-bbd7-5610b38e37f2",
    price: item.price,
    quantity: item.quantity,
    unit_of_measure: item.unit_of_measure,
    description: item.description,
    created_at: knexInstance.raw("NOW()"),
    last_updated_at: knexInstance.raw("NOW()"),
    is_damaged: item.is_damaged,
    damage_or_return_text: item.damage_or_return_text,
    project_id: item.project_id,
    purchase_order_item_status_id: item.purchase_order_item_status_id,
  }));

  try {
    await knexInstance("purchase_order_item").insert(dataToInsert);

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

export default postPurchaseOrderItems;
