import PurchaseOrderTransportationRequestComment from './DTO/PurchaseOrderTransportationRequestComment.js';
import {
  InternalServerError,
  DatabaseError,
  BadRequestError,
} from '/opt/nodejs/errors.js';
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

const postPurchaseOrderTransportationRequestComment = async (
  comment,
  purchaseOrderTransportationRequestId,
  userSub
) => {
  await initializeDb();

  if (
    !comment ||
    typeof comment !== 'object' ||
    Object.keys(comment).length === 0
  ) {
    throw new BadRequestError('The comment parameter must not be empty');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const purchaseOrderTransportationRequestComment =
    new PurchaseOrderTransportationRequestComment(comment);

  const dataToInsert = {
    purchase_order_transportation_request_comment_id: uuidv4(),
    purchase_order_transportation_request_id:
      purchaseOrderTransportationRequestId,
    comment_text: purchaseOrderTransportationRequestComment.comment_text,
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('purchase_order_transportation_request_comment').insert(
      dataToInsert
    );

    return createSuccessResponse({
      message:
        'Purchase Order Transportation Request Comment added successfully!',
    });
  } catch (error) {
    console.error(
      'Error in postPurchaseOrderTransportationRequestComment:',
      error
    );
    throw new InternalServerError();
  }
};

export default postPurchaseOrderTransportationRequestComment;
