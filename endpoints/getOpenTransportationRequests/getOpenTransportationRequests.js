import initializeKnex from "/opt/nodejs/db/index.js";
import { InternalServerError, DatabaseError } from "/opt/nodejs/errors.js";
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

const getOpenTransportationRequests = async (
    searchText,
    pageNumber,
    pageSize
) => {
    await initializeDb();
    try {
        if (pageNumber < 1) pageNumber = 1;
        const offset = (pageNumber - 1) * pageSize;
        const query = knexInstance(
            "purchase_order_transportation_request as potr"
        )
            .select([
                "potr.*", // fetch all columns from purchase_order_transportation_request
                "p.project_name",
                knexInstance.raw(
                    "CONCAT(u.first_name, ' ', u.last_name) as requester"
                ),
                "po.purchase_order_number",
                "po.vendor_id",
                "po.shipping_cost",
                "po.estimated_taxes",
                "v.vendor_name as vendorName",
                "trs.transportation_request_status_name",
                "trt.transportation_request_type_name",
                "uos.urgent_order_status_name",
                knexInstance.raw(
                    "COALESCE(comments.comment_count::INTEGER, 0) as comment_count"
                ),
            ])
            .select(
                knexInstance.raw(
                    "json_agg(json_build_object('purchaseOrderItemId' , pot.purchase_order_item_id, 'unitOfMeasure', pot.unit_of_measure, 'description', pot.description ,'price', pot.price, 'quantity', pot.quantity, 'isDamaged', pot.is_damaged, 'damageOrReturnText', pot.damage_or_return_text, 'projectId', pot.project_id, 'purchaseOrderItemStatusId', pot.purchase_order_item_status_id, 's3Uri', pot.s3_uri, 'itemName', pot.item_name, 'suggestedVendor', pot.suggested_vendor, 'urgentOrderStatusId', pot.urgent_order_status_id)) as purchase_order_items"
                )
            )
            .leftJoin(
                knexInstance("purchase_order_transportation_request_comment")
                    .select("purchase_order_transportation_request_id")
                    .count("* as comment_count")
                    .groupBy("purchase_order_transportation_request_id")
                    .as("comments"),
                "comments.purchase_order_transportation_request_id",
                "=",
                "potr.purchase_order_transportation_request_id"
            )
            .leftJoin("project as p", "p.project_id", "potr.project_id")
            .leftJoin("user as u", "u.user_id", "potr.created_by")
            .leftJoin(
                "purchase_order as po",
                "po.purchase_order_id",
                "potr.purchase_order_id"
            )
            .leftJoin("vendor as v", "v.vendor_id", "po.vendor_id")
            .leftJoin(
                "transportation_request_status as trs",
                "trs.transportation_request_status_id",
                "potr.transportation_request_status_id"
            )
            .leftJoin(
                "transportation_request_type as trt",
                "trt.transportation_request_type_id",
                "potr.transportation_request_type_id"
            )
            .leftJoin(
                "urgent_order_status as uos",
                "uos.urgent_order_status_id",
                "potr.urgent_order_status_id"
            )
            .leftJoin(
                "purchase_order_item as pot",
                "pot.purchase_order_id",
                "po.purchase_order_id"
            )
            .groupBy(
                "potr.purchase_order_transportation_request_id",
                "potr.purchase_order_id",
                "potr.transportation_request_type_id",
                "potr.from_location",
                "potr.to_location",
                "potr.additional_details",
                "potr.urgent_order_status_id",
                "potr.transportation_request_status_id",
                "potr.future_transportation_date",
                "potr.item_name",
                "potr.recipients",
                "potr.contact_number",
                "potr.contact_name",
                "potr.project_id",
                "potr.is_active",
                "p.project_name",
                "po.shipping_cost",
                "po.estimated_taxes",
                "requester",
                "po.purchase_order_number",
                "trs.transportation_request_status_name",
                "trt.transportation_request_type_name",
                "uos.urgent_order_status_name",
                "comment_count",
                "vendorName",
                "po.vendor_id"
            )
            .where("potr.transportation_request_status_id", 1)
            .andWhere("potr.is_active", true)
            .orderBy("potr.future_transportation_date", "asc");

        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(po.purchase_order_number, ' ', potr.item_name, ' ', u.first_name, ' ', u.last_name, ' ', trs.transportation_request_status_name)`
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

        const openTransportationRequests = await query
            .clone()
            .offset(offset)
            .limit(pageSize);

        return createSuccessResponse({
            data: openTransportationRequests,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching Open Transportation Requests:", error);
        throw new InternalServerError();
    }
};

export default getOpenTransportationRequests;
