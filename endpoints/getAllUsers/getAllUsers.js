import initializeKnex from "/opt/nodejs/db/index.js";
import { InternalServerError, DatabaseError } from "/opt/nodejs/errors.js";
import { createSuccessResponse } from "/opt/nodejs/apiResponseUtil.js";
// import { getPageOffsetFromPageNo } from "/opt/nodejs/backendUtil.js";

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

const getAllUsers = async (userRole, searchText, pageNumber, pageSize) => {
    await initializeDb();
    try {
        if (pageNumber < 1) pageNumber = 1;
        const offset = (pageNumber - 1) * pageSize;
        // const offset = getPageOffsetFromPageNo(pageNumber);
        let query = knexInstance
            .select(
                "u.*",
                knexInstance.raw(
                    '("createdby".first_name || \' \' || "createdby".last_name) AS Createdby'
                ),
                knexInstance.raw(
                    '("updatedby".first_name || \' \' || "updatedby".last_name) AS Updatedby'
                )
            )
            .from("user as u")
            .join("user as createdby", "createdby.user_id", "=", "u.created_by")
            .join(
                "user as updatedby",
                "updatedby.user_id",
                "=",
                "u.last_updated_by"
            )
            .orderBy("u.created_at", "asc");
        if (userRole) {
            query = query
                .where("u.is_active", true)
                .andWhere("u.user_role", userRole);
        }
        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(u.first_name, ' ', u.last_name, ' ', u.user_email, ' ', u.user_role, ' ', u.ocr_tool_id, ' ', createdby.first_name, ' ', createdby.last_name, ' ', updatedby.first_name, ' ', updatedby.last_name)`
                ),
                `%${searchText}%`
            );
        }

        let responseData = [];

        if (!userRole) {
            const countQuery = query
                .clone()
                .select(knexInstance.raw("COUNT(*) OVER() as count"))
                .limit(1)
                .first();

            const totalCount = (await countQuery).count;
            const users = await query.clone().offset(offset).limit(pageSize);

            responseData = {
                data: users,
                totalCount,
            };
        } else {
            responseData = await query;
        }

        return createSuccessResponse(responseData);
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new InternalServerError();
    }
};

export default getAllUsers;
