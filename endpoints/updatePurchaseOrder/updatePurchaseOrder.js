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

const updatePurchaseOrder = async (item) => {
  await initializeDb();

  if (!item.purchase_order_id) {
    throw new Error('Missing purchase_order_id');
  }

  const purchaseOrder = new PurchaseOrder(item)

  await knexInstance('purchase_order')
    .where(
      'purchase_order_id',
      purchaseOrder.purchase_order_id
    )
    .update(purchaseOrder);

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
