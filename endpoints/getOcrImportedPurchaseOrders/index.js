import getOcrImportedPurhaseOrders from "./getOcrImportedPurchaseOrders.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";

const handler = async (event) => {
    try {
        const queryParams = event.queryStringParameters;
        const userSub = queryParams ? queryParams.userSub : null;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;

        return await getOcrImportedPurhaseOrders(
            userSub,
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
