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

const getPurchaseOrderItems = async (purchase_order_id) => {
    await initializeDb();
    try {
        const getPurchaseOrderItems = await knexInstance(
            "purchase_order_item"
        )
            .join(
                "project",
                "project.project_id",
                "=",
                "purchase_order_item.project_id"
            )
            .join(
                "purchase_order_item_status",
                "purchase_order_item_status.purchase_order_item_status_id",
                "=",
                "purchase_order_item.purchase_order_item_status_id"
            )
            .select(
                "purchase_order_item.purchase_order_item_id",
                "purchase_order_item.purchase_order_id",
                "purchase_order_item.price",
                "purchase_order_item.quantity",
                "purchase_order_item.unit_of_measure",
                "purchase_order_item.description",
                "purchase_order_item.is_damaged",
                "purchase_order_item.damage_or_return_text",
                "purchase_order_item.project_id",
                "purchase_order_item.purchase_order_item_status_id",
                "purchase_order_item.s3_uri",
                "purchase_order_item.item_name",
                "project.project_name",
                "purchase_order_item_status.purchase_order_item_status_name"
            )
            .where(
                "purchase_order_item.purchase_order_id",
                "=",
                purchase_order_id
            )
            .andWhere("purchase_order_item.is_active", "=", true);

        return {
            statusCode: 200,
            body: JSON.stringify(getPurchaseOrderItems),
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    } catch (error) {
        console.error("Error fetching PurchaseOrderItems:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: `Server Error, ${error}`,
            }),
        };
    }
};

export default getPurchaseOrderItems;
