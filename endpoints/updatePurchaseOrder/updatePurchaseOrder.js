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

const updatePurchaseOrder = async (purchaseOrder) => {
  await initializeDb();

  if (!purchaseOrder.purchase_order_id) {
    throw new Error('Missing purchase_order_id');
  }

  const purchaseOrderData = new PurchaseOrder({
    ...purchaseOrder, last_updated_at: knexInstance.raw('NOW()'),
    last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
  })

  await knexInstance('purchase_order')
    .where(
      'purchase_order_id',
      purchaseOrderData.purchase_order_id
    )
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
