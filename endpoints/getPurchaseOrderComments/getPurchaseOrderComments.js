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

const getPurchaseOrderComments = async (purchaseOrderId) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderComments = await knexInstance
      .select(
        'purchase_order_comment.purchase_order_comment_id',
        'purchase_order_comment.purchase_order_id',
        'purchase_order_comment.created_by',
        'purchase_order_comment.created_at',
        'purchase_order_comment.comment_text',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('purchase_order_comment')
      .join('user', 'purchase_order_comment.created_by', '=', 'user.user_id')
      .where('purchase_order_comment.purchase_order_id', purchaseOrderId);

    return createSuccessResponse(getAllPurchaseOrderComments);
  } catch (error) {
    console.error('Error fetching Purchase Order Comments:', error);
    throw error;
  }
};

export default getPurchaseOrderComments;
