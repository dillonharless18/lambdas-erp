import updatePurchaseOrderTransportationRequest from './updatePurchaseOrderTransportationRequest.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).transportationRequest
    const purchaseOrderTransportationRequestId = event.pathParameters?.purchase_order_transportation_request_id;

    return await updatePurchaseOrderTransportationRequest(body, purchaseOrderTransportationRequestId);
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
