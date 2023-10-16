import initializeKnex from '/opt/nodejs/db/index.js';
import { InternalServerError, DatabaseError } from '/opt/nodejs/errors.js';
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

const getPurchaseOrderTransportationComments = async (
  purchaseOrderTransportationRequestId
) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderTransportationRequestComments = await knexInstance
      .select(
        'purchase_order_transportation_request_comment.purchase_order_transportation_request_comment_id',
        'purchase_order_transportation_request_comment.purchase_order_transportation_request_id',
        'purchase_order_transportation_request_comment.created_by',
        'purchase_order_transportation_request_comment.created_at',
        'purchase_order_transportation_request_comment.comment_text',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('purchase_order_transportation_request_comment')
      .join(
        'user',
        'purchase_order_transportation_request_comment.created_by',
        '=',
        'user.user_id'
      )
      .where(
        'purchase_order_transportation_request_comment.purchase_order_transportation_request_id',
        purchaseOrderTransportationRequestId
      );

    return createSuccessResponse(
      getAllPurchaseOrderTransportationRequestComments
    );
  } catch (error) {
    console.error(
      'Error fetching Purchase Order Transportation Request Comments:',
      error
    );
    throw new InternalServerError();
  }
};

export default getPurchaseOrderTransportationComments;
