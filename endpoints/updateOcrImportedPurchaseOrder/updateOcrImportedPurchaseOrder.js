import OcrImportedPurchaseOrder from './DTO/OcrImportedPruchaseOrder.js';
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

const updateOcrImportedPurchaseOrder = async (
  ocrImportedPurchaseOrderId,
  ocrImportedPurchaseOrderObject
) => {
  await initializeDb();

  if (
    typeof ocrImportedPurchaseOrderObject !== 'object' ||
    ocrImportedPurchaseOrderObject === null
  ) {
    console.error(
      'Error: The ocrImportedPurchaseOrderObject parameter must be an object'
    );
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Invalid input format: The ocrImportedPurchaseOrderObject parameter must be an object',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  const ocrImportedPurchaseOrder = new OcrImportedPurchaseOrder(
    ocrImportedPurchaseOrderObject
  );

  const updatedItem = {
    last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    last_updated_at: knexInstance.raw('NOW()'),
  };

  if (ocrImportedPurchaseOrder.ocr_suggested_purchase_order_number)
    updatedItem.ocr_suggesetd_purchase_order_number =
      ocrImportedPurchaseOrder.ocr_suggested_purchase_order_number;

  if (ocrImportedPurchaseOrder.vendor_id)
    updatedItem.vendor_id = ocrImportedPurchaseOrder.vendor_id;

  if (ocrImportedPurchaseOrder.credit_card_id)
    updatedItem.credit_card_id = ocrImportedPurchaseOrder.credit_card_id;

  await knexInstance('ocr_imported_purchase_order_draft')
    .where('ocr_imported_purchase_order_draft_id', ocrImportedPurchaseOrderId)
    .update(updatedItem);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Ocr Imported Purchase Order updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updateOcrImportedPurchaseOrder;
