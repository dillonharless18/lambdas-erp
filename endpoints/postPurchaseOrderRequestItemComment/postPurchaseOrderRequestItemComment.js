import PurchaseOrderRequestItemComment from "./DTO/PurchaseOrderRequestItemComment.js";
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

const postPurchaseOrderRequestItemComment = async (comment) => {
  await initializeDb();

  if (!comment) {
    throw new Error("The comment parameter must not be null");
  }

  const purchaseOrderRequestItemComment = new PurchaseOrderRequestItemComment(
    comment
  );

  const dataToInsert = {
    purchase_order_request_item_comment_id: uuidv4(),
    purchase_order_request_item_id:
      purchaseOrderRequestItemComment.purchase_order_request_item_id,
    comment_text: purchaseOrderRequestItemComment.comment_text,
    created_by: "1b3ef41c-23af-4eee-bbd7-5610b38e37f2",
    created_at: knexInstance.raw("NOW()"),
  };

  try {
    await knexInstance("purchase_order_request_item_comment").insert(
      dataToInsert
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Purchase Order Request Item Comment added successfully!",
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error("Error in postPurchaseOrderRequestItemComment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export default postPurchaseOrderRequestItemComment;
