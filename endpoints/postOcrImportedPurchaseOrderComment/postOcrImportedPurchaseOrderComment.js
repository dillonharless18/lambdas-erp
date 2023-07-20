import OcrImportedPurchaseOrderComment from './DTO/OcrImportedPurchaseOrderComment.js';
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

const postOcrImportedPurchaseOrderComment = async (comment, userSub) => {
  await initializeDb();

  if (!comment) {
    throw new Error('The comment parameter must not be null');
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          'Ocr Imported Purchase Order Draft Comment added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in Ocr Imported Purchase Order Draft Comment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postOcrImportedPurchaseOrderComment;
