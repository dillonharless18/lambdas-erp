import initializeKnex from "/opt/nodejs/db/index.js";
import { DatabaseError, NotFoundError } from "/opt/nodejs/errors.js";
import { createSuccessResponse } from "/opt/nodejs/apiResponseUtil.js";

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

const getPurchaseOrderRequestItems = async (
    status,
    userSub,
    searchText,
    pageNumber,
    pageSize
    // urgentOrderStatus,
    // vendor,
    // pageNumber
) => {
    await initializeDb();
    try {
        if (pageNumber < 1) pageNumber = 1;
        const offset = (pageNumber - 1) * pageSize;
        const query = knexInstance("purchase_order_request_item")
            .join(
                "user as createdBy",
                "createdBy.user_id",
                "=",
                "purchase_order_request_item.created_by"
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
            .leftJoin(
                knexInstance("purchase_order_request_item_comment")
                    .select("purchase_order_request_item_id")
                    .count("* as comment_count")
                    .groupBy("purchase_order_request_item_id")
                    .as("comments"),
                "comments.purchase_order_request_item_id",
                "=",
                "purchase_order_request_item.purchase_order_request_item_id"
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
                knexInstance.raw(
                    '("createdBy".first_name || \' \' || "createdBy".last_name) AS requester'
                ),
                "project.project_name",
                "urgent_order_status.urgent_order_status_name as urgent_status",
                "vendor.vendor_name",
                "purchase_order_request_item_status.purchase_order_request_item_status_name",
                knexInstance.raw(
                    "COALESCE(comments.comment_count::INTEGER, 0) as comment_count"
                )
            )
            .where(
                "purchase_order_request_item_status.purchase_order_request_item_status_name",
                "=",
                status
            )
            .andWhere("purchase_order_request_item.is_active", "=", true)
            .orderBy("purchase_order_request_item.created_at", "asc");

        if (userSub) {
            const user = await knexInstance("user")
                .where("cognito_sub", userSub)
                .pluck("user_id");

            query.where("purchase_order_request_item.created_by", "=", user[0]);
        }

        if (searchText) {
            query
                .whereILike(
                    "purchase_order_request_item.item_name",
                    `%${searchText}%`
                )
                .orWhereILike(
                    "urgent_order_status.urgent_order_status_name",
                    `%${searchText}%`
                )
                .orWhereILike(
                    "purchase_order_request_item.quantity",
                    `%${searchText}%`
                )
                .orWhereILike(
                    "purchase_order_request_item.description",
                    `%${searchText}%`
                )
                .orWhereILike(
                    "purchase_order_request_item.unit_of_measure",
                    `%${searchText}%`
                )
                .orWhereILike(
                    "purchase_order_request_item.suggested_vendor",
                    `%${searchText}%`
                )
                .orWhereILike("createdBy.first_name", `%${searchText}%`)
                .orWhereILike("createdBy.last_name", `%${searchText}%`)
                .orWhereRaw(
                    "CAST(purchase_order_request_item.created_at AS TEXT) ILIKE ?",
                    [`%${searchText}%`]
                )
                .orWhereILike("project.project_name", `%${searchText}%`)
                .orWhereILike("vendor.vendor_name", `%${searchText}%`);
        }

        const countQuery = query
            .clone()
            .clearSelect()
            .clearOrder()
            .count({ count: "*" });
        const totalCount = (await countQuery)[0].count;

        const getAllPurchaseOrderRequestItems = await query
            .clone()
            .offset(offset)
            .limit(pageSize);

        return createSuccessResponse({
            data: getAllPurchaseOrderRequestItems,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching PurchaseOrderRequestItems:", error);
        throw error;
    }
};

export default getPurchaseOrderRequestItems;
