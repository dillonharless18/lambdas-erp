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
            .select(
                "purchase_order.purchase_order_id",
                "purchase_order.last_updated_by",
                "purchase_order.created_by",
                "purchase_order.created_at",
                "purchase_order.created_by",
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
                "purchase_order_status.purchase_order_status_name"
            )
            .where(
                "purchase_order_status.purchase_order_status_name",
                "=",
                status
            );

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
