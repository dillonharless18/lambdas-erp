import updateOcrImportedPurchaseOrder from './updatePurchaseOrderRequestItem.js';

const handler = async (event) => {
  try {
    const ocrImportedPurchaseOrderDraftId =
      event.pathParameters?.ocr_imported_purchase_order_draft_id;
    const body = JSON.parse(event.body).ocrImportedPurchaseOrder;

    if (!ocrImportedPurchaseOrderDraftId) {
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
      ocrImportedPurchaseOrderDraftId,
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
