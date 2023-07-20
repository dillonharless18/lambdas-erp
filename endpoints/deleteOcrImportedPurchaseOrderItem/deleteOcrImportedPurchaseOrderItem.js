import initializeKnex from '/opt/nodejs/db/index.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const deleteOcrImportedPurchaseOrderItem = async (
  ocrImportedPurchaseOrderItemId
) => {
  await initializeDb();

  try {
    await knexInstance('ocr_imported_purchase_order_draft_item')
      .where(
        'ocr_imported_purchase_order_draft_item_id',
        ocrImportedPurchaseOrderItemId
      )
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Ocr Imported Purchase Order Item deleted successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in OcrImportedPurchaseOrderItem:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error.message}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
export default deleteOcrImportedPurchaseOrderItem;
