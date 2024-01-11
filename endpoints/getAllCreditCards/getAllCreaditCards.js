import initializeKnex from "/opt/nodejs/db/index.js";
import { DatabaseError } from "/opt/nodejs/errors.js";
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

const getAllCreditCards = async (isAll, searchText, pageNumber, pageSize) => {
    await initializeDb();
    try {
        if (pageNumber < 1) pageNumber = 1;
        const offset = (pageNumber - 1) * pageSize;
        const query = knexInstance
            .select(
                "cc.*",
                knexInstance.raw(
                    '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
                ),
                knexInstance.raw(
                    '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
                )
            )
            .from("credit_card as cc")
            .join(
                "user as createdBy",
                "createdBy.user_id",
                "=",
                "cc.created_by"
            )
            .join(
                "user as updatedBy",
                "updatedBy.user_id",
                "=",
                "cc.last_updated_by"
            )
            .orderBy("cc.created_at", "asc");
        let responseData = [];
        if (!isAll) {
            query.where("p.is_active", true);
            responseData = await query;
        } else {
            const countQuery = query
                .clone()
                .select(knexInstance.raw("COUNT(*) OVER() as count"))
                .limit(1)
                .first();

            const totalCount = (await countQuery).count;
            const data = await query.clone().offset(offset).limit(pageSize);

            responseData = { data, totalCount };
        }
        return createSuccessResponse(responseData);
    } catch (error) {
        console.error("Error fetching credit cards:", error.stack);
        throw error;
    }
};

export default getAllCreditCards;
