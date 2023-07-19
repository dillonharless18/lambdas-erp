import PurchaseOrderRequestItemComment from './DTO/PurchaseOrderRequestItemComment.js';
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

const postPurchaseOrderRequestItemComment = async (
  comment,
  purchaseOrderRequestItemId,
  userSub
) => {
  await initializeDb();

  if (!purchaseOrderRequestItemId) {
    throw new Error(
      'The purchase_order_request_item_id field must not be null'
    );
  } else if (!comment) {
    throw new Error('The comment parameter must not be null');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const purchaseOrderRequestItemComment = new PurchaseOrderRequestItemComment(
    comment
  );

  const dataToInsert = {
    purchase_order_request_item_comment_id: uuidv4(),
    purchase_order_request_item_id: purchaseOrderRequestItemId,
    comment_text: purchaseOrderRequestItemComment.comment_text,
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('purchase_order_request_item_comment').insert(
      dataToInsert
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Purchase Order Request Item Comment added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postPurchaseOrderRequestItemComment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postPurchaseOrderRequestItemComment;
