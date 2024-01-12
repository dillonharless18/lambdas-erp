import initializeKnex from "/opt/nodejs/db/index.js";
import { DatabaseError, NotFoundError } from "/opt/nodejs/errors.js";
import { createSuccessResponse } from "/opt/nodejs/apiResponseUtil.js";
import { getPageOffsetFromPageNo } from "/opt/nodejs/backendUtil.js";

let knexInstance;

const initializeDb = async () => {
    if (!knexInstance) {
        try {
            knexInstance = await initializeKnex();
        } catch (error) {
            console.error("Error initializing database:", error.stack);
            throw new DatabaseError("Failed to initialize the database.");
        }
    }
};

const getAllCustomers = async (isAll, searchText, pageNumber, pageSize) => {
    await initializeDb();
    try {
        const offset = getPageOffsetFromPageNo(pageNumber);
        let query = knexInstance
            .select(
                "c.*",
                knexInstance.raw(
                    '("createdby".first_name || \' \' || "createdby".last_name) AS Createdby'
                ),
                knexInstance.raw(
                    '("updatedby".first_name || \' \' || "updatedby".last_name) AS Updatedby'
                )
            )
            .from("customer as c")
            .orderBy("c.created_at", "asc")
            .join("user as createdby", "createdby.user_id", "=", "c.created_by")
            .join(
                "user as updatedby",
                "updatedby.user_id",
                "=",
                "c.last_updated_by"
            );
        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(c.customer_name, ' ', c.email, ' ', createdby.first_name, ' ', createdby.last_name, ' ', updatedby.first_name, ' ', updatedby.last_name, ' ', c.city)`
                ),
                `%${searchText}%`
            );
        }
        let responseData = [];
        if (!isAll) {
            query.where("c.is_active", true);
            responseData = await query;
            if (!responseData || responseData.length === 0) {
                throw new NotFoundError("No customers found.");
            }
        } else {
            const countQuery = query
                .clone()
                .select(knexInstance.raw("COUNT(*) OVER() as count"))
                .limit(1)
                .first();

            const totalCount = (await countQuery).count;
            const data = await query.clone().offset(offset).limit(pageSize);
            if (!responseData || responseData.length === 0) {
                throw new NotFoundError("No customers found.");
            }
            responseData = { data, totalCount };
        }

        return createSuccessResponse(responseData);
    } catch (error) {
        console.error("Error fetching customers:", error.stack);
        throw new InternalServerError();
    }
};

export default getAllCustomers;
