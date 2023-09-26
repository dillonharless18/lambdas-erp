import PurchaseOrderRequestItemComment from './DTO/PurchaseOrderRequestItemComment.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseError, NotFoundError } from '/opt/nodejs/errors.js';
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

const postPurchaseOrderRequestItemComment = async (
  comment,
  purchaseOrderRequestItemId,
  userSub
) => {
  await initializeDb();

  if (!purchaseOrderRequestItemId) {
    throw BadRequestError(
      'The purchase_order_request_item_id field must not be null'
    );
  } else if (!comment) {
    throw new BadRequestError('The comment parameter must not be null');
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

    return createSuccessResponse({
      message: 'Purchase Order Request Item Comment added successfully!',
    });
  } catch (error) {
    console.error('Error in postPurchaseOrderRequestItemComment:', error.stack);
    throw error;
  }
};

export default postPurchaseOrderRequestItemComment;
