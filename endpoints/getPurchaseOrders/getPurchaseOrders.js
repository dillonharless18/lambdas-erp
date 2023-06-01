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

const getPurchaseOrders = async (status) => {
    await initializeDb();
    try {
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
                knexInstance.raw(
                    'JSON_AGG(' +
                    'JSON_BUILD_OBJECT(' +
                    '\'purchase_order_item_id\', purchase_order_item.purchase_order_item_id,' +
                    '\'purchase_order_id\', purchase_order_item.purchase_order_id,' +
                    '\'created_by\', purchase_order_item.created_by,' +
                    '\'last_updated_by\', purchase_order_item.last_updated_by,' +
                    '\'price\', purchase_order_item.price,' +
                    '\'quantity\', purchase_order_item.quantity,' +
                    '\'unit_of_measure\', purchase_order_item.unit_of_measure,' +
                    '\'description\', purchase_order_item.description,' +
                    '\'created_at\', purchase_order_item.created_at,' +
                    '\'last_updated_at\', purchase_order_item.last_updated_at,' +
                    '\'is_damaged\', purchase_order_item.is_damaged,' +
                    '\'damage_or_return_text\', purchase_order_item.damage_or_return_text,' +
                    '\'project_id\', purchase_order_item.project_id,' +
                    '\'purchase_order_item_status_id\', purchase_order_item.purchase_order_item_status_id,' +
                    '\'s3_uri\', purchase_order_item.s3_uri,' +
                    '\'item_name\', purchase_order_item.item_name,' +
                    '\'suggested_vendor\', purchase_order_item.suggested_vendor,' +
                    '\'urgent_order_status_id\', purchase_order_item.urgent_order_status_id,' +
                    '\'is_active\', purchase_order_item.is_active,' +
                    '\'purchase_order_item_status_name\', purchase_order_item_status.purchase_order_item_status_name' +
                    '\'project_name\', project.project_name' +
                    ')' +
                    ') AS purchase_order_items'
                )
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
