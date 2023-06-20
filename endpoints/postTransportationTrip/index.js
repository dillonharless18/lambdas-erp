import postTransportationTrip from './postTransportationTrip.js';

const handler = async (event) => {
  try {
    const purchaseOrderTransportationRequestId =
      event.pathParameter?.purchaseOrderTransportationRequestId;
    const body = JSON.parse(event.body).transportationTrip;

    if (!purchaseOrderTransportationRequestId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing purchaseOrderTransportationRequestId path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return await postTransportationTrip(
      purchaseOrderTransportationRequestId,
      body
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
