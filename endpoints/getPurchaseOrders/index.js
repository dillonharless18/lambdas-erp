import getPurchaseOrders from "./getPurchaseOrders.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";
import { BadRequestError } from "/opt/nodejs/errors.js";

const handler = async (event) => {
    try {
        const queryParams = event.queryStringParameters;
        const status = queryParams.status;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;
        if (!status) {
            throw new BadRequestError("Query param Status is missing");
        }
        return await getPurchaseOrders(
            status,
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
