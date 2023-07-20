import updateTransportationTripByPurchaseOrderRequest from './updateTransportationTripByPurchaseOrderRequest.js';

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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export { handler };
