import PurchaseOrder from './DTO/PurchaseOrder.js';
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

const updatePurchaseOrder = async (purchaseOrder, purchaseOrderId, userSub) => {
  await initializeDb();

  try {
    if (!purchaseOrderId) {
      throw new BadRequestError('The purchase_order_id field must not be null');
    }

    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    let purchaseOrderData = new PurchaseOrder({
      ...purchaseOrder,
      last_updated_by: user[0],
      last_updated_at: knexInstance.raw('NOW()'),
    });

    purchaseOrderData = Object.fromEntries(
      Object.entries(purchaseOrderData).filter(
        ([_, val]) => val !== null && val !== undefined && val !== ''
      )
    ); // remove null or empty values

    await knexInstance('purchase_order')
      .where('purchase_order_id', purchaseOrderId)
      .update(purchaseOrderData);

    return createSuccessResponse({
      message: 'Purchase Order updated successfully!',
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default updatePurchaseOrder;
