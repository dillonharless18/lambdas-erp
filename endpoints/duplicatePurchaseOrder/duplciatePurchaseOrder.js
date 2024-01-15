import PurchaseOrderDTO from "./DTO/PurchaseOrderDTO.js";
import { DatabaseError, BadRequestError } from "/opt/nodejs/errors.js";
import { createSuccessResponse } from "/opt/nodejs/apiResponseUtil.js";
import initializeKnex from "/opt/nodejs/db/index.js";
import { v4 as uuidv4 } from "uuid";

let knexInstance;

const initializeDb = async () => {
    try {
        if (!knexInstance) {
            knexInstance = await initializeKnex();
        }
    } catch (error) {
        console.error("Error initializing database:", error.stack);
        throw new DatabaseError("Failed to initialize the database.");
    }
};

const duplicatePurchaseOrder = async (order, userSub) => {
    await initializeDb();

    if (typeof order !== "object" || order === null) {
        console.error("Error: The order parameter must be an object");
        throw new BadRequestError(
            "Invalid input format: The order parameter must be an object"
        );
    }

    const user = await knexInstance("user")
        .where("cognito_sub", userSub)
        .pluck("user_id");

    const purchaseOrder = new PurchaseOrderDTO(order);
    let purchaseOrderDetails;
    try {
        await knexInstance.transaction(async (trx) => {
            const purchase_order_id = uuidv4();
            if (purchaseOrder.purchase_order_number) {
                purchaseOrder.purchase_order_number = Math.floor(
                    Math.random() * 1e12
                ).toString();
            }

            purchaseOrderDetails = await trx("purchase_order")
                .insert({
                    purchase_order_id,
                    created_by: user[0],
                    last_updated_by: user[0],
                    total_price: purchaseOrder.total_price,
                    vendor_id: purchaseOrder.vendor_id,
                    purchase_order_status_id:
                        purchaseOrder.purchase_order_status_id,
                    s3_uri: purchaseOrder.s3_uri,
                    shipping_cost: purchaseOrder.shipping_cost,
                    estimated_taxes: purchaseOrder.estimated_taxes,
                    created_at: knexInstance.raw("NOW()"),
                    last_updated_at: knexInstance.raw("NOW()"),
                    purchase_order_number:
                        purchaseOrder?.purchase_order_number ?? null,
                    quickbooks_purchase_order_id: "1",
                })
                .returning(["purchase_order_number", "purchase_order_id"]);

            const purchaseOrderItemPromises =
                purchaseOrder.purchaseOrderItems.map(async (item) => {
                    const purchaseOrderItemId = await trx("purchase_order_item")
                        .insert({
                            purchase_order_item_id: uuidv4(),
                            purchase_order_id: purchase_order_id,
                            created_by: user[0],
                            last_updated_by: user[0],
                            price: item.price,
                            quantity: item.quantity,
                            unit_of_measure: item.unit_of_measure,
                            description: item.description,
                            project_id: item.project_id,
                            purchase_order_item_status_id:
                                item.purchase_order_item_status_id,
                            s3_uri: item.s3_uri,
                            item_name: item.item_name,
                            suggested_vendor: item.suggested_vendor,
                            urgent_order_status_id: item.urgent_order_status_id,
                            created_at: knexInstance.raw("NOW()"),
                            last_updated_at: knexInstance.raw("NOW()"),
                            is_active: true,
                        })
                        .returning("purchase_order_item_id");

                    await trx(
                        "purchase_order_request_item_by_purchase_order_item"
                    ).insert({
                        purchase_order_item_id:
                            purchaseOrderItemId[0].purchase_order_item_id,
                        purchase_order_request_item_id:
                            item.purchase_order_request_item_id,
                    });

                    await knexInstance("purchase_order_request_item")
                        .where(
                            "purchase_order_request_item_id",
                            item.purchase_order_request_item_id
                        )
                        .update({
                            is_active: false,
                            last_updated_at: knexInstance.raw("NOW()"),
                        });
                });

            await Promise.all(purchaseOrderItemPromises);
        });

        return createSuccessResponse({
            message: "Purchase Order duplicated successfully!",
            purchaseOrderDetails: purchaseOrderDetails,
        });
    } catch (error) {
        console.error("Error in duplicatePurchaseOrder:", error.stack);
        throw error;
    }
};

export default duplicatePurchaseOrder;
