import getOpenTransportationRequests from "./getOpenTransportationRequests.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";

const handler = async (event) => {
    try {
        const queryParams = event.queryStringParameters;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;
        return await getOpenTransportationRequests(
            searchText,
            pageNumber,
            pageSize
        );
    } catch (error) {
        console.error("Error in handler:", error);
        return createErrorResponse(error);
    }
};

export { handler };
