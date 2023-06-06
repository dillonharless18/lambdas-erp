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

const postPurchaseOrderComment = async (comment, purchaseOrderId) => {
  await initializeDb();

  if (!purchaseOrderId) {
    throw new Error('The purchase_order_id field must not be null');
  } else if (!comment || typeof comment !== 'object' || Object.keys(comment).length === 0) {
    throw new Error('The comment parameter must not be empty');
  }
  const purchaseOrderComment = new PurchaseOrderComment({
    purchase_order_comment_id: uuidv4(),
    purchase_order_id: purchaseOrderId,
    created_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
    created_at: knexInstance.raw('NOW()'),
    ...comment
  })

  try {
    await knexInstance('purchase_order_comment').insert(
      purchaseOrderComment
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
