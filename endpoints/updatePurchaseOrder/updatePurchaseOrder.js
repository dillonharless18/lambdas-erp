import PurchaseOrder from './DTO/PurchaseOrder.js';
import initializeKnex from '/opt/nodejs/db/index.js';

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

const updatePurchaseOrder = async (purchaseOrder, purchaseOrderId, userSub) => {
  await initializeDb();

  if (!purchaseOrderId) {
    throw new Error('The purchase_order_id field must not be null');
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Purchase Order updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updatePurchaseOrder;
