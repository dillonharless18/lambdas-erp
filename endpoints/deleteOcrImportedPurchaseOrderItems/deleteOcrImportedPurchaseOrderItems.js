import initializeKnex from '/opt/nodejs/db/index.js';
import {
  DatabaseError,
  BadRequestError,
  InternalServerError,
} from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error.stack);
    throw new DatabaseError('Failed to initialize the database.');
  }
};

const deleteOcrImportedPurchaseOrderItems = async (requestBody, userSub) => {
  await initializeDb();

  if (
    !requestBody ||
    !requestBody.ocrImportedPurchaseOrderItems ||
    !Array.isArray(requestBody.ocrImportedPurchaseOrderItems)
  ) {
    throw new BadRequestError('Invalid request body');
  }
  try {
    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const ocrImportedPurchaseOrderItemIds =
      requestBody.ocrImportedPurchaseOrderItems.map(
        (item) => item.ocr_imported_purchase_order_draft_item_id
      );

    await knexInstance('ocr_imported_purchase_order_draft_item')
      .whereIn(
        'ocr_imported_purchase_order_draft_item_id',
        ocrImportedPurchaseOrderItemIds
      )
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
        last_updated_by: user[0],
      });

    return createSuccessResponse({
      message: 'OcrImportedPurchaseOrderItem(s) deleted successfully!.',
    });
  } catch (error) {
    console.error(
      'Error in deleteOcrImportedPurchaseOrderItems: ',
      error.stack
    );
    throw new InternalServerError();
  }
};

export default deleteOcrImportedPurchaseOrderItems;
