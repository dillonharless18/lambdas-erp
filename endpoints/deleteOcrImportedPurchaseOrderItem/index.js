import deleteNetVendorRequestItem from './deleteOcrImportedPurchaseOrderItem.js';

const handler = async (event) => {
  try {
    const ocrImportedPurchaseOrderItemId =
      event.pathParameters?.ocr_imported_purchase_order_draft_item_id;

    if (!ocrImportedPurchaseOrderItemId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing ocr_imported_purchase_order_draft_item_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return await deleteNetVendorRequestItem(ocrImportedPurchaseOrderItemId);
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
