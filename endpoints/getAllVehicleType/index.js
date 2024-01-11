import getAllVehicleType from "./getAllVehicleType.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";

const handler = async (event, context) => {
    try {
        const queryParams = event.queryStringParameters;
        const isAll = queryParams?.isAll;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;
        return await getAllVehicleType(isAll, searchText, pageNumber, pageSize);
    } catch (error) {
        console.error("Error in handler:", error);
        return createErrorResponse(error);
    }
};

export { handler };
