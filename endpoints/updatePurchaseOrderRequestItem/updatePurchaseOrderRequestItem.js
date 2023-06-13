import PurchaseOrderRequestItem from './DTO/PurchaseOrderRequestItem.js';
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

const updatePurchaseOrderRequestItem = async (item) => {
  await initializeDb();

  if (typeof item !== 'object' || item === null) {
    console.error('Error: The item parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: The item parameter must be an object',
      }),
    };
  }

  const purchaseOrderRequestItem = new PurchaseOrderRequestItem(item);

  const updatedItem = {
    last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    last_updated_at: knexInstance.raw('NOW()'),
  };

  if (purchaseOrderRequestItem.item_name)
    updatedItem.item_name = purchaseOrderRequestItem.item_name;
  if (purchaseOrderRequestItem.quantity)
    updatedItem.quantity = purchaseOrderRequestItem.quantity;
  if (purchaseOrderRequestItem.unit_of_measure)
    updatedItem.unit_of_measure = purchaseOrderRequestItem.unit_of_measure;
  if (purchaseOrderRequestItem.description)
    updatedItem.description = purchaseOrderRequestItem.description;
  if (purchaseOrderRequestItem.project_id)
    updatedItem.project_id = purchaseOrderRequestItem.project_id;
  if (purchaseOrderRequestItem.vendor_id)
    updatedItem.vendor_id = purchaseOrderRequestItem.vendor_id;
  if (purchaseOrderRequestItem.urgent_order_status_id)
    updatedItem.urgent_order_status_id =
      purchaseOrderRequestItem.urgent_order_status_id;

  await knexInstance('purchase_order_request_item')
    .where(
      'purchase_order_request_item_id',
      purchaseOrderRequestItem.purchase_order_request_item_id
    )
    .update(updatedItem);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Purchase Order Request Item updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updatePurchaseOrderRequestItem;
