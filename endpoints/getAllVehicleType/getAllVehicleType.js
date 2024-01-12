import initializeKnex from "/opt/nodejs/db/index.js";
import { InternalServerError, DatabaseError } from "/opt/nodejs/errors.js";
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

const getAllVehicleType = async (isAll, searchText, pageNumber, pageSize) => {
    await initializeDb();
    try {
        const offset = getPageOffsetFromPageNo(pageNumber);
        let query = knexInstance
            .select(
                "vt.*",
                knexInstance.raw(
                    '("createdby".first_name || \' \' || "createdby".last_name) AS Createdby'
                ),
                knexInstance.raw(
                    '("updatedby".first_name || \' \' || "updatedby".last_name) AS Updatedby'
                )
            )
            .from("vehicle_type as vt")
            .join(
                "user as createdby",
                "createdby.user_id",
                "=",
                "vt.created_by"
            )
            .join(
                "user as updatedby",
                "updatedby.user_id",
                "=",
                "vt.last_updated_by"
            )
            .orderBy("vt.created_at", "asc");

        let responseData = [];
        if (searchText) {
            query.whereILike(
                knexInstance.raw(
                    `concat(vt.vehicle_type_name, ' ', createdby.first_name, ' ', createdby.last_name, ' ', updatedby.first_name, ' ', updatedby.last_name)`
                ),
                `%${searchText}%`
            );
        }
        if (!isAll) {
            query = query.where("vt.is_active", true);
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
        console.error("Error fetching vehicle type:", error);
        throw new InternalServerError();
    }
};

export default getAllVehicleType;
