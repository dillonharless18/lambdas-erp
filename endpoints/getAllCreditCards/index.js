import getAllCreditCards from "./getAllCreaditCards.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";

const handler = async (event, context) => {
    try {
        const queryParams = event.queryStringParameters;
        const isAll = queryParams?.isAll ?? null;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;
        return await getAllCreditCards(isAll, searchText, pageNumber, pageSize);
    } catch (error) {
        console.error("Error in handler:", error.stack);
        return createErrorResponse(error);
    }
};

export { handler };
