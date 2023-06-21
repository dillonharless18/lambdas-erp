import deleteOpenTransportationRequest from './deleteOpenTransportationRequest.js';

const handler = async (event) => {
  try {
    const purchaseOrderTransportationRequestId =
      event.pathParameters?.purchase_order_transportation_request_id;
    if (!purchaseOrderTransportationRequestId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            'Missing purchase_order_transportation_request_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return await deleteOpenTransportationRequest(
      purchaseOrderTransportationRequestId
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
