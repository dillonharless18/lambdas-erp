import getTransportationTrips from "./getTransportationTrips.js";
import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";

const handler = async (event) => {
    try {
        const queryParams = event.queryStringParameters;
        const transportationTripStatus = queryParams
            ? queryParams.status
            : null;
        const isAll = queryParams?.isAll ?? null;
        const searchText = queryParams?.searchText;
        const pageNumber = queryParams?.pageNumber;
        const pageSize = queryParams?.pageSize;

        return await getTransportationTrips(
            transportationTripStatus,
            isAll,
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
