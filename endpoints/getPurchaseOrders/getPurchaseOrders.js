import initializeKnex from "/opt/nodejs/db/index.js";
import { DatabaseError, BadRequestError } from "/opt/nodejs/errors.js";
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

const createJsonAgg = (JsonBuildList, aliasName) => {
    if (!Array.isArray(JsonBuildList) || JsonBuildList.length === 0) {
        throw new BadRequestError("Missing or empty required array parameter!");
    }
    const jsonAggPrefix = "JSON_AGG(JSON_BUILD_OBJECT(";
    const jsonAggSuffix = `)) AS ${aliasName}`;
    let jsonAgg = "";

    for (let i = 0; i < JsonBuildList.length; i++) {
        const currentBuildListDict = JsonBuildList[i];
        const isLastRow = i === JsonBuildList.length - 1;

        jsonAgg += makeJsonAggRow(
            currentBuildListDict["key"],
            currentBuildListDict["valuePrefix"],
            currentBuildListDict["valueSuffix"],
            isLastRow
        );
    }

    return jsonAggPrefix + jsonAgg + jsonAggSuffix;
};

const makeJsonAggRow = (key, valuePrefix, valueSuffix, isLastRow) => {
    return `\'${key}\', ${valuePrefix}.${valueSuffix}` + (isLastRow ? "" : ",");
};

const getPurchaseOrders = async (status, searchText, pageNumber, pageSize) => {
    await initializeDb();
    try {
        const jsonBuildList = [
            {
                key: "purchase_order_item_id",
                valuePrefix: "purchase_order_item",
                valueSuffix: "purchase_order_item_id",
            },
            {
                key: "purchase_order_id",
                valuePrefix: "purchase_order_item",
                valueSuffix: "purchase_order_id",
            },
            {
                key: "created_by",
                valuePrefix: "purchase_order_item",
                valueSuffix: "created_by",
            },
            {
                key: "last_updated_by",
                valuePrefix: "purchase_order_item",
                valueSuffix: "last_updated_by",
            },
            {
                key: "price",
                valuePrefix: "purchase_order_item",
                valueSuffix: "price",
            },
            {
                key: "quantity",
                valuePrefix: "purchase_order_item",
                valueSuffix: "quantity",
            },
            {
                key: "unit_of_measure",
                valuePrefix: "purchase_order_item",
                valueSuffix: "unit_of_measure",
            },
            {
                key: "description",
                valuePrefix: "purchase_order_item",
                valueSuffix: "description",
            },
            {
                key: "created_at",
                valuePrefix: "purchase_order_item",
                valueSuffix: "created_at",
            },
            {
                key: "last_updated_at",
                valuePrefix: "purchase_order_item",
                valueSuffix: "last_updated_at",
            },
            {
                key: "is_damaged",
                valuePrefix: "purchase_order_item",
                valueSuffix: "is_damaged",
            },
            {
                key: "damage_or_return_text",
                valuePrefix: "purchase_order_item",
                valueSuffix: "damage_or_return_text",
            },
            {
                key: "project_id",
                valuePrefix: "purchase_order_item",
                valueSuffix: "project_id",
            },
            {
                key: "purchase_order_item_status_id",
                valuePrefix: "purchase_order_item",
                valueSuffix: "purchase_order_item_status_id",
            },
            {
                key: "s3_uri",
                valuePrefix: "purchase_order_item",
                valueSuffix: "s3_uri",
            },
            {
                key: "item_name",
                valuePrefix: "purchase_order_item",
                valueSuffix: "item_name",
            },
            {
                key: "suggested_vendor",
                valuePrefix: "purchase_order_item",
                valueSuffix: "suggested_vendor",
            },
            {
                key: "urgent_order_status_id",
                valuePrefix: "purchase_order_item",
                valueSuffix: "urgent_order_status_id",
            },
            {
                key: "is_active",
                valuePrefix: "purchase_order_item",
                valueSuffix: "is_active",
            },
            {
                key: "purchase_order_item_status_name",
                valuePrefix: "purchase_order_item_status",
                valueSuffix: "purchase_order_item_status_name",
            },
            {
                key: "project_name",
                valuePrefix: "project",
                valueSuffix: "project_name",
            },
        ];
        if (pageNumber < 1) pageNumber = 1;
        const offset = (pageNumber - 1) * pageSize;

        let query = knexInstance("purchase_order as po")
            .leftJoin(
                "purchase_order_comment",
                "po.purchase_order_id",
                "=",
                "purchase_order_comment.purchase_order_id"
            )
            .leftJoin(
                knexInstance("purchase_order_comment")
                    .select("purchase_order_id")
                    .count("* as comment_count")
                    .groupBy("purchase_order_id")
                    .as("comments"),
                "comments.purchase_order_id",
                "=",
                "po.purchase_order_id"
            )
            .select(
                "po.purchase_order_id",
                "po.last_updated_by",
                "po.created_by",
                "po.created_at",
                "po.total_price",
                "po.purchase_order_number",
                "po.vendor_id",
                "po.purchase_order_status_id",
                "po.quickbooks_purchase_order_id",
                "po.s3_uri",
                "po.shipping_cost",
                "po.estimated_taxes",
                knexInstance.raw(
                    '("createdby".first_name || \' \' || "createdby".last_name) AS requester'
                ),
                "vendor.vendor_name",
                "purchase_order_status.purchase_order_status_name",
                knexInstance.raw(
                    "COALESCE(comments.comment_count::INTEGER, 0) as comment_count"
                ),
                knexInstance.raw(
                    createJsonAgg(jsonBuildList, "purchase_order_items")
                )
            )
            .join(
                "user as createdby",
                "createdby.user_id",
                "=",
                "po.created_by"
            )
            .join("vendor", "vendor.vendor_id", "=", "po.vendor_id")
            .join(
                "purchase_order_status",
                "purchase_order_status.purchase_order_status_id",
                "=",
                "po.purchase_order_status_id"
            )
            .join(
                "purchase_order_item",
                "po.purchase_order_id",
                "purchase_order_item.purchase_order_id"
            )
            .join(
                "purchase_order_item_status",
                "purchase_order_item_status.purchase_order_item_status_id",
                "purchase_order_item.purchase_order_item_status_id"
            )
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
            .groupBy(
                "po.purchase_order_id",
                "requester",
                "vendor.vendor_name",
                "purchase_order_status.purchase_order_status_name",
                "comments.comment_count"
            )
            .orderBy("po.created_at", "asc");
        if (status === "Received") {
            query = query.whereNot(
                "purchase_order_item_status.purchase_order_item_status_id",
                5
            ); // don't fetch returned items
        }
        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(po.purchase_order_number, ' ', vendor.vendor_name, ' ', createdby.first_name, ' ', createdby.last_name)`
                ),
                `%${searchText}%`
            );
        }
        const countQuery = query
            .clone()
            .select(knexInstance.raw("COUNT(*) OVER() as count"))
            .limit(1)
            .first();

        const totalCount = (await countQuery).count;

        const getPurchaseOrders = await query
            .clone()
            .offset(offset)
            .limit(pageSize);

        return createSuccessResponse({
            data: getPurchaseOrders,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching PurchaseOrders:", error);
        throw error;
    }
};

export default getPurchaseOrders;
