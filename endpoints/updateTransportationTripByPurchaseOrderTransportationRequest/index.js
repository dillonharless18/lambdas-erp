import updateTransportationTripByPurchaseOrderRequest from './updateTransportationTripByPurchaseOrderRequest.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestData;
    const transportationTripId = event.pathParameters?.transportation_trip_id;
    const purchaseOrderTransportationRequestId =
      event.pathParameters?.purchase_order_transportation_request_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updateTransportationTripByPurchaseOrderRequest(
      body,
      transportationTripId,
      purchaseOrderTransportationRequestId,
      userSub
    );
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
