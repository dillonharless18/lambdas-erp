import getPurchaseOrderRequestItems from "./getPurchaseOrderRequestItems.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";
import { BadRequestError } from "/opt/nodejs/errors.js";

const handler = async (event, context) => {
    try {
        const queryParams = event.queryStringParameters;
        const status = queryParams.status;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;
        const userSub = queryParams.userSub;
        if (!status) {
            throw new BadRequestError("Missing status path parameter");
        }
        return await getPurchaseOrderRequestItems(
            status,
            userSub,
            searchText,
            pageNumber,
            pageSize
            // urgentOrderStatus,
            // vendor,
        );
    } catch (error) {
        console.error("Error in handler:", error);
        return createErrorResponse(error);
    }
};

export { handler };
