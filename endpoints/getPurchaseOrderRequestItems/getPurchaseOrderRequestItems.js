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

const getPurchaseOrderRequestItems = async (
  purchase_order_request_item_status_id
) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderRequestItems = await knexInstance(
      "purchase_order_request_item"
    )
      .select(
        "purchase_order_request_item.purchase_order_request_item_id AS purchase_order_request_id",
        "purchase_order_request_item.quantity",
        "purchase_order_request_item.item_name",
        "purchase_order_request_item.unit_of_measure AS unit_of_measurement",
        "purchase_order_request_item.suggested_vendor",
        "purchase_order_request_item.description",
        "purchase_order_request_item.s3_uri",
        "purchase_order_request_item.created_at as requestDate",
        knexInstance.raw(`json_agg(
    json_build_object(
      'urgent_order_status_id', urgent_order_status.urgent_order_status_id,
      'urgent_order_status_name', urgent_order_status.urgent_order_status_name
    )
  ) AS urgent_order_status`),
        knexInstance.raw(`json_agg(
    json_build_object(
      'project_id', project.project_id,
      'project_name', project.project_name
    )
  ) AS project`),
        knexInstance.raw(`json_agg(
    json_build_object(
      'vendor_id', vendor.vendor_id,
      'vendor_name', vendor.vendor_name
    )
  ) AS vendor`),
        knexInstance.raw(`json_agg(
    json_build_object(
      'requester', user.user_id,
      'requesterFirstName', user.first_name,
      'requesterLastName, user.last_name
    )
  ) AS requester`)
      )
      .leftJoin(
        "project",
        "purchase_order_request_item.project_id",
        "=",
        "project.project_id"
      )
      .leftJoin(
        "urgent_order_status",
        "purchase_order_request_item.urgent_order_status_id",
        "=",
        "urgent_order_status.urgent_order_status_id"
      )
      .leftJoin(
        "vendor",
        "purchase_order_request_item.vendor_id",
        "=",
        "vendor.vendor_id"
      )
      .leftJoin(
        "requester",
        "purchase_order_request_item.created_by",
        "=",
        "user.user_id"
      )
      .groupBy("purchase_order_request_item.purchase_order_request_item_id")
      .where(
        "purchase_order_request_item_status_id",
        purchase_order_request_item_status_id
      );

    return {
      statusCode: 200,
      body: JSON.stringify(getAllPurchaseOrderRequestItems),
    };
  } catch (error) {
    console.error("Error fetching PurchaseOrderRequestItems:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export default getPurchaseOrderRequestItems;
