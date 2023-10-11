import PurchaseOrderComment from './DTO/PurchaseOrderComment.js';
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

const postPurchaseOrderComment = async (comment, purchaseOrderId, userSub) => {
  await initializeDb();

  if (!purchaseOrderId) {
    throw new BadRequestError('The purchase_order_id field must not be null');
  } else if (
    !comment ||
    typeof comment !== 'object' ||
    Object.keys(comment).length === 0
  ) {
    throw new BadRequestError('The comment parameter must not be empty');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const purchaseOrderComment = new PurchaseOrderComment({
    purchase_order_comment_id: uuidv4(),
    purchase_order_id: purchaseOrderId,
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
    ...comment,
  });

  try {
    await knexInstance('purchase_order_comment').insert(purchaseOrderComment);

    return createSuccessResponse({
      message: 'Purchase Order Comment added successfully!',
    });
  } catch (error) {
    console.error('Error in postPurchaseOrderComment:', error);
    throw error;
  }
};

export default postPurchaseOrderComment;
