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


const createJsonAgg = (JsonBuildList, aliasName) => {
  if (!Array.isArray(JsonBuildList) || JsonBuildList.length === 0) {
    throw new Error("Missing or empty required array parameter!");
  }
  const jsonAggPrefix = 'JSON_AGG(JSON_BUILD_OBJECT(';
  const jsonAggSuffix = `)) AS ${aliasName}`;
  let jsonAgg = '';

  for (let i = 0; i < JsonBuildList.length; i++) {
    const currentBuildListDict = JsonBuildList[i];
    const isLastRow = i === JsonBuildList.length - 1;

    jsonAgg += makeJsonAggRow(
      currentBuildListDict['key'],
      currentBuildListDict['valuePrefix'],
      currentBuildListDict['valueSuffix'],
      isLastRow
    );

  }

  return jsonAggPrefix + jsonAgg + jsonAggSuffix;
}

const makeJsonAggRow = (key, valuePrefix, valueSuffix, isLastRow) => {
  return `\'${key}\', ${valuePrefix}.${valueSuffix}` + (isLastRow ? '' : ',');
}

const getPurchaseOrders = async (status) => {
  await initializeDb();
  try {
    const jsonBuildList = [
      {
        'key': 'purchase_order_item_id',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'purchase_order_item_id',
      },
      {
        'key': 'purchase_order_id',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'purchase_order_id',
      },
      {
        'key': 'created_by',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'created_by',
      },
      {
        'key': 'last_updated_by',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'last_updated_by',
      },
      {
        'key': 'price',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'price',
      },
      {
        'key': 'quantity',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'quantity',
      },
      {
        'key': 'unit_of_measure',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'unit_of_measure',
      },
      {
        'key': 'description',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'description',
      },
      {
        'key': 'created_at',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'created_at',
      },
      {
        'key': 'last_updated_at',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'last_updated_at',
      },
      {
        'key': 'is_damaged',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'is_damaged',
      },
      {
        'key': 'damage_or_return_text',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'damage_or_return_text',
      },
      {
        'key': 'project_id',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'project_id',
      },
      {
        'key': 'purchase_order_item_status_id',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'purchase_order_item_status_id',
      },
      {
        'key': 's3_uri',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 's3_uri',
      },
      {
        'key': 'item_name',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'item_name',
      },
      {
        'key': 'suggested_vendor',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'suggested_vendor',
      },
      {
        'key': 'urgent_order_status_id',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'urgent_order_status_id',
      },
      {
        'key': 'is_active',
        'valuePrefix': 'purchase_order_item',
        'valueSuffix': 'is_active',
      },
      {
        'key': 'purchase_order_item_status_name',
        'valuePrefix': 'purchase_order_item_status',
        'valueSuffix': 'purchase_order_item_status_name',
      },
      {
        'key': 'project_name',
        'valuePrefix': 'project',
        'valueSuffix': 'project_name',
      }
    ];

    const getPurchaseOrders = await knexInstance("purchase_order")
      .select(
        "purchase_order.purchase_order_id",
        "purchase_order.last_updated_by",
        "purchase_order.created_by",
        "purchase_order.created_at",
        "purchase_order.total_price",
        "purchase_order.purchase_order_number",
        "purchase_order.vendor_id",
        "purchase_order.purchase_order_status_id",
        "purchase_order.quickbooks_purchase_order_id",
        "purchase_order.s3_uri",
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS requester'
        ),
        "vendor.vendor_name",
        "purchase_order_status.purchase_order_status_name",
        knexInstance.raw(createJsonAgg(jsonBuildList, 'purchase_order_items'))
      )
      .join(
        "user as createdBy",
        "createdBy.user_id",
        "=",
        "purchase_order.created_by"
      )
      .join("vendor", "vendor.vendor_id", "=", "purchase_order.vendor_id")
      .join(
        "purchase_order_status",
        "purchase_order_status.purchase_order_status_id",
        "=",
        "purchase_order.purchase_order_status_id"
      )
      .join('purchase_order_item', 'purchase_order.purchase_order_id', 'purchase_order_item.purchase_order_id')
      .join('purchase_order_item_status', 'purchase_order_item_status.purchase_order_item_status_id', 'purchase_order_item.purchase_order_item_status_id')
      .join(
        "project",
        "project.project_id",
        "=",
        "purchase_order_item.project_id"
      )
      .where(
        "purchase_order_status.purchase_order_status_name",
        "=",
        status
      )
      .groupBy("purchase_order.purchase_order_id",
        "purchase_order.last_updated_by",
        "purchase_order.created_by",
        "purchase_order.created_at",
        "purchase_order.total_price",
        "purchase_order.purchase_order_number",
        "purchase_order.vendor_id",
        "purchase_order.purchase_order_status_id",
        "purchase_order.quickbooks_purchase_order_id",
        "purchase_order.s3_uri",
        "requester",
        "vendor.vendor_name",
        "purchase_order_status.purchase_order_status_name"
      )

    return {
      statusCode: 200,
      body: JSON.stringify(getPurchaseOrders),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error fetching PurchaseOrders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Server Error, ${error}`,
      }),
    };
  }
};

export default getPurchaseOrders;
