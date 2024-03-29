import initializeKnex from "/opt/nodejs/db/index.js";
import { DatabaseError } from "/opt/nodejs/errors.js";
import { createSuccessResponse } from "/opt/nodejs/apiResponseUtil.js";
import { getPageOffsetFromPageNo } from "/opt/nodejs/backendUtil.js";

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

const getOcrImportedPurhaseOrders = async (
    userSub,
    searchText,
    pageNumber,
    pageSize
) => {
    await initializeDb();
    try {
        const offset = getPageOffsetFromPageNo(pageNumber, pageSize);
        const query = knexInstance("ocr_imported_purchase_order_draft as po")
            .leftJoin(
                "ocr_imported_purchase_order_draft_item as item",
                "po.ocr_imported_purchase_order_draft_id",
                "item.ocr_imported_purchase_order_draft_id"
            )
            .leftJoin("project", "item.project_id", "project.project_id")
            .leftJoin(
                "purchase_order_item_status",
                "item.purchase_order_item_status_id",
                "purchase_order_item_status.purchase_order_item_status_id"
            )
            .leftJoin(
                "vendor as vendor_items",
                "po.vendor_id",
                "vendor_items.vendor_id"
            )
            .leftJoin(
                "vendor as vendor_draft",
                "po.vendor_id",
                "vendor_draft.vendor_id"
            )
            .leftJoin(
                "user as user_created_pod",
                "po.created_by",
                "user_created_pod.user_id"
            )
            .leftJoin(
                "user as user_created_podi",
                "item.created_by",
                "user_created_podi.user_id"
            )
            .leftJoin(
                "credit_card",
                "po.credit_card_id",
                "credit_card.credit_card_id"
            )
            .leftJoin(
                knexInstance("ocr_imported_purchase_order_draft_comment")
                    .select("ocr_imported_purchase_order_draft_id")
                    .count("* as comment_count")
                    .groupBy("ocr_imported_purchase_order_draft_id")
                    .as("comments"),
                "comments.ocr_imported_purchase_order_draft_id",
                "=",
                "po.ocr_imported_purchase_order_draft_id"
            )
            .select(
                "po.ocr_imported_purchase_order_draft_id",
                knexInstance.raw(
                    "COALESCE(comments.comment_count::INTEGER, 0) as comment_count"
                ),
                knexInstance.raw(
                    `json_build_object('user_id', user_created_pod.user_id, 'requester', ("user_created_pod".first_name || ' ' || "user_created_pod".last_name)) as created_by`
                ),
                knexInstance.raw(
                    `json_build_object('credit_card_id', credit_card.credit_card_id, 'credit_card_name', credit_card.credit_card_name) as credit_card`
                ),
                knexInstance.raw(
                    `json_build_object('vendor_id', vendor_draft.vendor_id, 'vendor_name', vendor_draft.vendor_name) as vendor`
                ),
                "po.created_at",
                "po.last_updated_at",
                "po.ocr_suggested_vendor",
                "po.ocr_suggesetd_purchase_order_number",
                "po.s3_uri"
            )
            .select(
                knexInstance.raw(
                    "json_agg(json_build_object('ocr_imported_purchase_order_draft_item_id', item.ocr_imported_purchase_order_draft_item_id, 'ocr_imported_purchase_order_draft_id', item.ocr_imported_purchase_order_draft_id, 'item_name', item.item_name, 'price', item.price, 'quantity', item.quantity, 'unit_of_measure', item.unit_of_measure, 'description', item.description, 'project', json_build_object('project_name', project.project_name, 'project_id', project.project_id), 'created_at', item.created_at, 'last_updated_at', item.last_updated_at)) as ocr_imported_purchase_order_items"
                )
            )
            .groupBy(
                "po.ocr_imported_purchase_order_draft_id",
                "user_created_pod.user_id",
                "credit_card.credit_card_id",
                "vendor_draft.vendor_id",
                "comments.comment_count"
            )
            .orderBy("po.created_at", "asc")
            .where("po.is_active", "=", true)
            .andWhere("item.is_active", "=", true);

        if (userSub) {
            const user = await knexInstance("user")
                .where("cognito_sub", userSub)
                .pluck("user_id");

            query
                .where("user_created_pod.created_by", "=", user[0])
                .andWhere("user_created_podi.created_by", "=", user[0]);
        }
        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(po.ocr_suggesetd_purchase_order_number, ' ', vendor_draft.vendor_name, ' ', user_created_pod.first_name, ' ', user_created_pod.last_name, ' ', credit_card.credit_card_name)`
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

        const octImportedPurchaseOrders = await query
            .clone()
            .offset(offset)
            .limit(pageSize);

        return createSuccessResponse({
            data: octImportedPurchaseOrders,
            totalCount,
        });
    } catch (error) {
        console.error(
            "Error fetching OCR Imported Purchase Orders:",
            error.stack
        );
        throw error;
    }
};

export default getOcrImportedPurhaseOrders;
