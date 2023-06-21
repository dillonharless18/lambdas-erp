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

const updatePurchaseOrder = async (purchaseOrder, purchaseOrderId) => {
  await initializeDb();

  if (!purchaseOrderId) {
    throw new Error('The purchase_order_id field must not be null');
  }

  let purchaseOrderData = new PurchaseOrder({
    ...purchaseOrder,
    last_updated_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
    last_updated_at: knexInstance.raw('NOW()'),
  });

  purchaseOrderData = Object.fromEntries(
    Object.entries(purchaseOrderData).filter(([_, val]) => val !== null && val !== undefined && val !== "")
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
