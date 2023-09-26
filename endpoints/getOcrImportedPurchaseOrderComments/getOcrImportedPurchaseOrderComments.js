import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError } from '/opt/nodejs/errors.js';
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

const getOcrImportedPurchaseOrderComments = async (
  ocr_imported_purchase_order_draft_id
) => {
  await initializeDb();
  try {
    const getAllOcrImportedPurchaseOrderComments = await knexInstance
      .select(
        'ocr_imported_purchase_order_draft_comment.*',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('ocr_imported_purchase_order_draft_comment')
      .join(
        'user',
        'ocr_imported_purchase_order_draft_comment.created_by',
        '=',
        'user.user_id'
      )
      .where(
        'ocr_imported_purchase_order_draft_comment.ocr_imported_purchase_order_draft_id',
        ocr_imported_purchase_order_draft_id
      );

    return createSuccessResponse(getAllOcrImportedPurchaseOrderComments);
  } catch (error) {
    console.error(
      'Error fetching OCR Imported Purchase Order Comments:',
      error.stack
    );
    throw error;
  }
};

export default getOcrImportedPurchaseOrderComments;
