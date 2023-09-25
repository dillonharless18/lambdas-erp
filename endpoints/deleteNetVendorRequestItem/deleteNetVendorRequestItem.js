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

const deleteNetVendorRequestItem = async (netVendorRequestItemId) => {
  await initializeDb();

  try {
    await knexInstance('purchase_order_request_item')
      .where('purchase_order_request_item_id', netVendorRequestItemId)
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
      });

    return createSuccessResponse({
      message: 'Net Vendor Request Item deleted successfully!',
    });
  } catch (error) {
    console.error('Error in deletePurchaseOrderRequestItem:', error.stack);
    throw error;
  }
};
export default deleteNetVendorRequestItem;
