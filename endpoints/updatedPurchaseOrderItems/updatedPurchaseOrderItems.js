import PurchaseOrderItem from './DTO/PurchaseOrderItem';
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


const updatePurchaseOrderItems = async (items) => {
  await initializeDb();

  if (!Array.isArray(items)) {
    throw new Error('The items parameter must be an array');
  }

  const purchaseOrderItems = items.map(
    (item) => new PurchaseOrderItem(item)
  );

  await Promise.all(
    purchaseOrderItems.map(async (item) => {

      let updatedItem = {
        last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
        last_updated_at: knexInstance.raw('NOW()'),
        ...item
      };

      updatedItem = Object.fromEntries(Object.entries(updatedItem).filter(([_, val]) => val))

      await knexInstance('purchase_order_item')
        .where(
          'purchase_order_item_id',
          updatedItem.purchase_order_item_id
        )
        .update(updatedItem);
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Purchase Order Items updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updatePurchaseOrderItems;