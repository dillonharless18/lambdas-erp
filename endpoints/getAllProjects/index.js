import getAllProjects from "./getAllProjects.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";

const handler = async (event, context) => {
    try {
        const queryParams = event.queryStringParameters;
        const isAll = queryParams?.isAll;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;
        const status = queryParams?.status;
        return await getAllProjects(
            isAll,
            searchText,
            pageNumber,
            pageSize,
            status
        );
    } catch (error) {
        console.error("Error in handler:", error.stack); // Logging error stack
        return createErrorResponse(error);
    }
};

export { handler };
