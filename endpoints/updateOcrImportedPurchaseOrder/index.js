import updateOcrImportedPurchaseOrder from './updatePurchaseOrderRequestItem.js';

const handler = async (event) => {
  try {
    const ocrImportedPurchaseOrderId =
      event.pathParameters?.ocrImportedPurchaseOrderId;
    const body = JSON.parse(event.body).ocrImportedPurchaseOrder;

    if (!ocrImportedPurchaseOrderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing ocrImportedPurchaseOrderId path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return await updateOcrImportedPurchaseOrder(
      ocrImportedPurchaseOrderId,
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
