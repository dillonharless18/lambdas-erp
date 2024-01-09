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

const getAllVendors = async (netVendors, searchText, pageNumber, pageSize) => {
    await initializeDb();
    try {
        const offset = getPageOffsetFromPageNo(pageNumber);
        let query = knexInstance
            .select(
                "v.*",
                knexInstance.raw(
                    '("createdby".first_name || \' \' || "createdby".last_name) AS Createdby'
                ),
                knexInstance.raw(
                    '("updatedby".first_name || \' \' || "updatedby".last_name) AS Updatedby'
                )
            )
            .from("vendor as v")
            .join("user as createdby", "createdby.user_id", "=", "v.created_by")
            .join(
                "user as updatedby",
                "updatedby.user_id",
                "=",
                "v.last_updated_by"
            )
            .where("v.is_active", true)
            .orderBy("v.created_at", "asc");

        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(v.vendor_name, ' ', v.billing_contact, ' ', createdby.first_name, ' ', createdby.last_name, ' ', updatedby.first_name, ' ', updatedby.last_name, ' ', v.account_payable_contact, ' ', v.email)`
                ),
                `%${searchText}%`
            );
        }
        let responseData = [];
        if (netVendors) {
            query = query.andWhere("is_net_vendor", true);
            responseData = await query;
        } else {
            const countQuery = query
                .clone()
                .select(knexInstance.raw("COUNT(*) OVER() as count"))
                .limit(1)
                .first();

            const totalCount = (await countQuery).count;
            const allVendors = await query
                .clone()
                .offset(offset)
                .limit(pageSize);

            responseData = {
                data: allVendors,
                totalCount,
            };
        }

        return createSuccessResponse(responseData);
    } catch (error) {
        console.error("Error fetching vendors:", error);
        throw error;
    }
};

export default getAllVendors;
