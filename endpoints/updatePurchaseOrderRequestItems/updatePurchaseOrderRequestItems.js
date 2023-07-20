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

const purchaseOrderItemStatusAgainstVendor = async (vendorId) => {
  try {
    const isNetVendor = await knexInstance('vendor')
      .select('is_net_vendor')
      .where('vendor_id', vendorId)
      .andWhere('is_active', true)
      .first();

    if (isNetVendor.is_net_vendor) {
      return 3; // Needs Procurement
    }

    return 2; // Purchase
  } catch (error) {
    console.error('Error fetching net vendor status:', error);
    throw error;
  }
};

const updatePurchaseOrderRequestItems = async (items, userSub) => {
  await initializeDb();

  if (!Array.isArray(items)) {
    throw new Error('The items parameter must be an array');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const purchaseOrderItems = items.map(
    (item) => new PurchaseOrderRequestItem(item)
  );

  await Promise.all(
    purchaseOrderItems.map(async (item) => {
      const purchaseOrderItemStatus =
        await purchaseOrderItemStatusAgainstVendor(item.vendor_id);

      const updatedItem = {
        last_updated_by: user[0],
        last_updated_at: knexInstance.raw('NOW()'),
      };

      if (item.item_name) updatedItem.item_name = item.item_name;
      if (item.price) updatedItem.price = item.price;
      if (item.quantity) updatedItem.quantity = item.quantity;
      if (item.unit_of_measure)
        updatedItem.unit_of_measure = item.unit_of_measure;
      if (item.suggested_vendor)
        updatedItem.suggested_vendor = item.suggested_vendor;
      if (item.s3_uri) updatedItem.s3_uri = item.s3_uri;
      if (item.description) updatedItem.description = item.description;
      if (item.project_id) updatedItem.project_id = item.project_id;
      if (item.vendor_id) updatedItem.vendor_id = item.vendor_id;
      if (item.urgent_order_status_id)
        updatedItem.urgent_order_status_id = item.urgent_order_status_id;

      if (purchaseOrderItemStatus)
        updatedItem.purchase_order_request_item_status_id =
          purchaseOrderItemStatus;

      await knexInstance('purchase_order_request_item')
        .where(
          'purchase_order_request_item_id',
          item.purchase_order_request_item_id
        )
        .update(updatedItem);
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Purchase Order Request Items updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updatePurchaseOrderRequestItems;
