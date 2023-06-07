import getOcrImportedPurchaseOrderComments from './getOcrImportedPurchaseOrderComments.js';

const handler = async (event, context) => {
  try {
    const ocrImportedOrderId =
      event.pathParameters?.ocr_imported_purchase_order_draft_id;
    if (!ocrImportedOrderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing ocr_imported_purchase_order_draft_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    return await getOcrImportedPurchaseOrderComments(
      ocrImportedOrderId
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
