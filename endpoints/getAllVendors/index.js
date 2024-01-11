import getAllVendors from "./getAllVendors.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";

const handler = async (event, context) => {
    try {
        const queryParams = event.queryStringParameters;
        const netVendors = queryParams ? queryParams.netVendors : null;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;

        return await getAllVendors(
            netVendors,
            searchText,
            pageNumber,
            pageSize
        );
    } catch (error) {
        console.error("Error in handler:", error.stack);
        return createErrorResponse(error);
    }
};

export { handler };
