import OcrImportedPurchaseOrderItem from './DTO/OcrImportedPurchaseOrderItem.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

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

const postOcrImportedPurchaseOrderItem = async (ocrImportedPurchaseOrderItem) => {
  await initializeDb();

  if (
    typeof ocrImportedPurchaseOrderItem !== 'object' ||
    ocrImportedPurchaseOrderItem === null
  ) {
    console.error(
      'Error: The ocrImportedPurchaseOrderItem parameter must be an object'
    );
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Invalid input format: The ocrImportedPurchaseOrderItem parameter must be an object',
      }),
    };
  }

  try {
    const ocrImportedPOItem = new OcrImportedPurchaseOrderItem(
      ocrImportedPurchaseOrderItem
    );
    await knexInstance('ocr_imported_purchase_order_item_id').insert({
      ocr_imported_purchase_order_draft_item_id: uuidv4(),
      ocr_imported_purchase_order_draft_id: ocrImportedPOItem.ocr_imported_purchase_order_draft_id,
      created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
      last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
      price: ocrImportedPOItem.price,
      quantity: ocrImportedPOItem.quantity,
      unit_of_measure: ocrImportedPOItem.unit_of_measure,
      description: ocrImportedPOItem.description,
      project_id: ocrImportedPOItem.project_id,
      purchase_order_item_status_id: '1', // OCR Processed
      item_name: ocrImportedPOItem.item_name,
      created_at: knexInstance.raw('NOW()'),
      last_updated_at: knexInstance.raw('NOW()'),
      is_active: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'OCR Imported Purchase Order Item added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postOceImportedPurchaseOrderItem:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postOcrImportedPurchaseOrderItem;
