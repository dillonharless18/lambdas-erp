import initializeKnex from "/opt/nodejs/db/index.js";
import { DatabaseError, InternalServerError } from "/opt/nodejs/errors.js";
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

const getAllProjects = async (
    isAll,
    searchText,
    pageNumber,
    pageSize,
    status
) => {
    await initializeDb();
    try {
        const offset = getPageOffsetFromPageNo(pageNumber);
        let query = knexInstance
            .select(
                "p.*",
                knexInstance.raw(
                    '("createdby".first_name || \' \' || "createdby".last_name) AS Createdby'
                ),
                knexInstance.raw(
                    '("updatedby".first_name || \' \' || "updatedby".last_name) AS Updatedby'
                )
            )
            .from("project as p")
            .orderBy("p.created_at", "asc")
            .join("user as createdby", "createdby.user_id", "=", "p.created_by")
            .join(
                "user as updatedby",
                "updatedby.user_id",
                "=",
                "p.last_updated_by"
            );

        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(p.project_name, ' ', p.project_cde, ' ', createdby.first_name, ' ', createdby.last_name, ' ', updatedby.first_name, ' ', updatedby.last_name)`
                ),
                `%${searchText}%`
            );
        }
        let responseData = [];
        if (!isAll) {
            // it means it is not called from admin/job workspace
            query.where("p.is_active", true);
            responseData = await query;
        } else {
            const activeJobsCountQuery = query
                .clone()
                .where("p.is_active", true)
                .select(knexInstance.raw("COUNT(*) OVER() as count"))
                .limit(1)
                .first();

            const inactiveJobsCountQuery = query
                .clone()
                .where("p.is_active", false)
                .select(knexInstance.raw("COUNT(*) OVER() as count"))
                .limit(1)
                .first();

            const activeJobs = (await activeJobsCountQuery).count;
            const inactiveJobs = (await inactiveJobsCountQuery).count;

            query.andWhere("p.is_active", status === "true" ? true : false);
            const data = await query.clone().offset(offset).limit(pageSize);

            responseData = {
                data,
                activeJobs,
                inactiveJobs,
            };
        }

        return createSuccessResponse(responseData);
    } catch (error) {
        console.error("Error fetching projects:", error.stack);
        throw new InternalServerError();
    }
};

export default getAllProjects;
