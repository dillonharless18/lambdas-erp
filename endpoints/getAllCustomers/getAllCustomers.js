import initializeKnex from "/opt/nodejs/db/index.js";
import { DatabaseError, NotFoundError } from "/opt/nodejs/errors.js";
import { createSuccessResponse } from "/opt/nodejs/apiResponseUtil.js";

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

const getAllCustomers = async (isAll) => {
    await initializeDb();
    try {
        if (pageNumber < 1) pageNumber = 1;
        const offset = (pageNumber - 1) * pageSize;
        let query = knexInstance
            .select(
                "c.*",
                knexInstance.raw(
                    '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
                ),
                knexInstance.raw(
                    '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
                )
            )
            .from("customer as c")
            .orderBy("c.created_at", "asc")
            .join("user as createdBy", "createdBy.user_id", "=", "c.created_by")
            .join(
                "user as updatedBy",
                "updatedBy.user_id",
                "=",
                "c.last_updated_by"
            );

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
