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

const getPurchaseOrderRequestItems = async (status) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderRequestItems = await knexInstance(
      "purchase_order_request_item"
    )
      .join(
        "user as createdBy",
        "createdBy.user_id",
        "=",
        "purchase_order_request_item.created_by"
      )
      .join(
        "user as updatedBy",
        "updatedBy.user_id",
        "=",
        "purchase_order_request_item.last_updated_by"
      )
      .join(
        "project",
        "project.project_id",
        "=",
        "purchase_order_request_item.project_id"
      )
      .join(
        "urgent_order_status",
        "urgent_order_status.urgent_order_status_id",
        "=",
        "purchase_order_request_item.urgent_order_status_id"
      )
      .join(
        "vendor",
        "vendor.vendor_id",
        "=",
        "purchase_order_request_item.vendor_id"
      )
      .join(
        "purchase_order_request_item_status",
        "purchase_order_request_item_status.purchase_order_request_item_status_id",
        "=",
        "purchase_order_request_item.purchase_order_request_item_status_id"
      )
      .select(
        "purchase_order_request_item.purchase_order_request_item_id",
        "purchase_order_request_item.last_updated_by",
        "purchase_order_request_item.created_by",
        "purchase_order_request_item.item_name",
        "purchase_order_request_item.quantity",
        "purchase_order_request_item.unit_of_measure",
        "purchase_order_request_item.suggested_vendor",
        "purchase_order_request_item.s3_uri",
        "purchase_order_request_item.description",
        "purchase_order_request_item.created_at as requestedDate",
        "purchase_order_request_item.last_updated_at",
        "purchase_order_request_item.price",
        "purchase_order_request_item.vendor_id",
        "purchase_order_request_item.project_id",
        "purchase_order_request_item.purchase_order_request_item_status_id",
        "purchase_order_request_item.urgent_order_status_id",
        knex.raw('CONCAT(createdBy.first_name, " ", createdBy.last_name) as requester'),
        knex.raw('CONCAT(updatedBy.first_name, " ", updatedBy.last_name) as updatedBy'),
        "project.project_name",
        "urgent_order_status.urgent_order_status_name as urgent_status",
        "vendor.vendor_name",
        "purchase_order_request_item_status.purchase_order_request_item_status_name"
      )
      .where(
        "purchase_order_request_item_status.purchase_order_request_item_status_name",
        "=",
        status
      ).andwhere("purchase_order_request_item.is_active", "=", true);

    return {
      statusCode: 200,
      body: JSON.stringify(getAllPurchaseOrderRequestItems),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error fetching PurchaseOrderRequestItems:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Server Error, ${error}`,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      } 
    };
  }
};

export default getPurchaseOrderRequestItems;