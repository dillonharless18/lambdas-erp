import PurchaseOrderComment from './DTO/PurchaseOrderComment.js';
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

const postPurchaseOrderComment = async (comment) => {
  await initializeDb();

  if (!comment) {
    throw new Error('No data provided');
  } else if (!comment.purchase_order_id) {
    throw new Error('The purchase_order_id field must not be null');
  } else if (!comment.comment_text) {
    throw new Error('The comment_text field must not be null');
  }

  const purchaseOrderComment = new PurchaseOrderComment(
    comment
  );

  const dataToInsert = {
    purchase_order_comment_id: uuidv4(),
    purchase_order_id: purchaseOrderComment.purchase_order_id,
    comment_text: purchaseOrderComment.comment_text,
    created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    created_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('purchase_order_comment').insert(
      dataToInsert
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Purchase Order Comment added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postPurchaseOrderComment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postPurchaseOrderComment;
