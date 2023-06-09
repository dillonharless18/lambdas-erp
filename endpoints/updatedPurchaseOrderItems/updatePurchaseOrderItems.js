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

  await Promise.all(
    items.map(async (item) => {
      let itemData = new PurchaseOrderItem({
        ...item,
        last_updated_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
        last_updated_at: knexInstance.raw('NOW()'),
      })

      itemData = Object.fromEntries(
        Object.entries(itemData).filter(([_, val]) => val !== null && val !== undefined && val !== "")
      ); // remove null or empty values

      await knexInstance('purchase_order_item')
        .where('purchase_order_item_id', itemData.purchase_order_item_id)
        .update(itemData);
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
