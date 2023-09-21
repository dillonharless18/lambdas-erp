import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError } from '/opt/nodejs/errors.js';
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

const getPurchaseOrderRequestItemsComments = async (
  purchaseOrderRequestItemId
) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderRequestItemComments = await knexInstance
      .select(
        'purchase_order_request_item_comment.*',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('purchase_order_request_item_comment')
      .join(
        'user',
        'purchase_order_request_item_comment.created_by',
        '=',
        'user.user_id'
      )
      .where(
        'purchase_order_request_item_comment.purchase_order_request_item_id',
        purchaseOrderRequestItemId
      );

    return createSuccessResponse(getAllPurchaseOrderRequestItemComments);
  } catch (error) {
    console.error(
      'Error fetching Purchase Order Request Item Comments:',
      error
    );
    throw error;
  }
};

export default getPurchaseOrderRequestItemsComments;
