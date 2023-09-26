import OcrImportedPurchaseOrderComment from './DTO/OcrImportedPurchaseOrderComment.js';
import { DatabaseError, BadRequestError } from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

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

const postOcrImportedPurchaseOrderComment = async (comment, userSub) => {
  await initializeDb();

  if (!comment) {
    throw new BadRequestError('The comment parameter must not be null');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const ocrImportedPurchaseOrderComment = new OcrImportedPurchaseOrderComment(
    comment
  );

  const dataToInsert = {
    ocr_imported_purchase_order_draft_comment_id: uuidv4(),
    ocr_imported_purchase_order_draft_id:
      ocrImportedPurchaseOrderComment.ocr_imported_purchase_order_draft_id,
    comment_text: ocrImportedPurchaseOrderComment.comment_text,
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('ocr_imported_purchase_order_draft_comment').insert(
      dataToInsert
    );

    return createSuccessResponse({
      message: 'Ocr Imported Purchase Order Draft Comment added successfully!',
    });
  } catch (error) {
    console.error(
      'Error in Ocr Imported Purchase Order Draft Comment:',
      error.stack
    );
    throw error;
  }
};

export default postOcrImportedPurchaseOrderComment;
