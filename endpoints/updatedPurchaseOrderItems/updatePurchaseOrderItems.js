import PurchaseOrderItem from './DTO/PurchaseOrderItem.js';
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

const updatePurchaseOrderItems = async (items, userSub) => {
  await initializeDb();

  if (!Array.isArray(items)) {
    throw new BadRequestError('The items parameter must be an array');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  await Promise.all(
    items.map(async (item) => {
      let itemData = new PurchaseOrderItem({
        ...item,
        last_updated_by: user[0],
        last_updated_at: knexInstance.raw('NOW()'),
      });

      itemData = Object.fromEntries(
        Object.entries(itemData).filter(
          ([_, val]) => val !== null && val !== undefined && val !== ''
        )
      ); // remove null or empty values

      await knexInstance('purchase_order_item')
        .where('purchase_order_item_id', itemData.purchase_order_item_id)
        .update(itemData);
    })
  );

  return createSuccessResponse({
    message: 'Purchase Order Items updated successfully!',
  });
};

export default updatePurchaseOrderItems;
