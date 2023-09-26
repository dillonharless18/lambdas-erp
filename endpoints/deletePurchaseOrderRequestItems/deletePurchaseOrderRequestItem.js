import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError, BadRequestError } from '/opt/nodejs/errors.js';
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

const deletePurchaseOrderRequestItems = async (requestBody) => {
  await initializeDb();

  if (
    !requestBody ||
    !requestBody.requestItems ||
    !Array.isArray(requestBody.requestItems)
  ) {
    throw new BadRequestError('Invalid request body');
  }

  try {
    const ids = requestBody.requestItems.map((item) => item.id);

    await knexInstance('purchase_order_request_item')
      .whereIn('purchase_order_request_item_id', ids)
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
      });

    return createSuccessResponse({
      message: 'Purchase Order Request Items deleted successfully!',
    });
  } catch (error) {
    console.error('Error in postPurchaseOrderRequestItems:', error);
    throw error;
  }
};
export default deletePurchaseOrderRequestItems;
