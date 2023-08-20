import OcrImportedPurchaseOrderItem from './DTO/OcrImportedPruchaseOrderItem.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError, NotFoundError } from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    // console.error('Error initializing database:', error);
    throw new DatabaseError('Failed to initialize the database.');
  }
};

const updateOcrImportedPurchaseOrderItem = async (
  ocrImportedPurchaseOrderItemId,
  ocrImportedPurchaseOrderItemObject,
  userSub
) => {
  await initializeDb();

  try {
    if (
      typeof ocrImportedPurchaseOrderItemObject !== 'object' ||
      ocrImportedPurchaseOrderItemObject === null
    ) {
      // console.error(
      //   'Error: The ocrImportedPurchaseOrderItemObject parameter must be an object'
      // );
      throw new NotFoundError(
        'The ocrImportedPurchaseOrderItemObject parameter must be an object.'
      );
    }

    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const ocrImportedPurchaseOrderItem = new OcrImportedPurchaseOrderItem(
      ocrImportedPurchaseOrderItemObject
    );

    const updatedItem = {
      last_updated_by: user[0],
      last_updated_at: knexInstance.raw('NOW()'),
    };

    for (let key of Object.keys(ocrImportedPurchaseOrderItem)) {
      if (ocrImportedPurchaseOrderItem[key]) {
        updatedItem[key] = ocrImportedPurchaseOrderItem[key];
      }
    }

    await knexInstance('ocr_imported_purchase_order_draft_item')
      .where(
        'ocr_imported_purchase_order_draft_item_id',
        ocrImportedPurchaseOrderItemId
      )
      .update(updatedItem);

    return createSuccessResponse(
      'Ocr Imported Purchase Order Item updated successfully!'
    );
  } catch (error) {
    // console.error('Error fetching projects:', error.stack); // Logging error stack
    throw error; // propagate the error to the handler
  }
};

export default updateOcrImportedPurchaseOrderItem;
