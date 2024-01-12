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

const getAllCreditCards = async (isAll, searchText, pageNumber, pageSize) => {
    await initializeDb();
    try {
        const offset = getPageOffsetFromPageNo(pageNumber);
        const query = knexInstance
            .select(
                "cc.*",
                knexInstance.raw(
                    '("createdby".first_name || \' \' || "createdby".last_name) AS Createdby'
                ),
                knexInstance.raw(
                    '("updatedby".first_name || \' \' || "updatedby".last_name) AS Updatedby'
                )
            )
            .from("credit_card as cc")
            .join(
                "user as createdby",
                "createdby.user_id",
                "=",
                "cc.created_by"
            )
            .join(
                "user as updatedby",
                "updatedby.user_id",
                "=",
                "cc.last_updated_by"
            )
            .orderBy("cc.created_at", "asc");

        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(cc.credit_card_name, ' ', cc.credit_card_last_four_digits, ' ', createdby.first_name, ' ', createdby.last_name, ' ', updatedby.first_name, ' ', updatedby.last_name)`
                ),
                `%${searchText}%`
            );
        }
        let responseData = [];
        if (!isAll) {
            query.where("cc.is_active", true);
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
