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

const postPurchaseOrderComments = async (comments, purchaseOrderId) => {
  await initializeDb();

  if (!purchaseOrderId) {
    throw new Error('The purchase_order_id field must not be null');
  } else if (!Array.isArray(comments) && comments.length > 0) {
    throw new Error('The comments parameter must be an array of comments');
  }
  const purchaseOrderComments = comments.map(
    (comment) => new PurchaseOrderComment({
      purchase_order_comment_id: uuidv4(),
      purchase_order_id: purchaseOrderId,
      created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
      created_at: knexInstance.raw('NOW()'),
      last_updated_at: knexInstance.raw('NOW()'),
      last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
      ...comment
    })
  );

  try {
    await knexInstance('purchase_order_comment').insert(
      purchaseOrderComments
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Purchase Order Comments added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postPurchaseOrderComments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postPurchaseOrderComments;
