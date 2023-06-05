import ItemRequest from './DTO/ItemRequests.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

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

const postItemRequests = async (items) => {
  await initializeDb();

  if (!Array.isArray(items)) {
    throw new Error('The items parameter must be an array');
  }

  const vendor = await knexInstance('vendor')
    .select('vendor_id')
    .where('vendor_name', 'Default')
    .andWhere('is_active', true)
    .first();

  const purchaseOrderRequestItemStatus = await knexInstance(
    'purchase_order_request_item_status'
  )
    .select('purchase_order_request_item_status_id')
    .where('purchase_order_request_item_status_name', 'Requested')
    .andWhere('is_active', true)
    .first();

  const purchaseOrderItems = items.map((item) => new ItemRequest(item));

  const dataToInsert = purchaseOrderItems.map((item) => ({
    purchase_order_request_item_id: uuidv4(),
    created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    item_name: item.item_name,
    price: item.price,
    quantity: item.quantity,
    unit_of_measure: item.unit_of_measure,
    suggested_vendor: item.suggested_vendor,
    s3_uri: item.s3_uri,
    description: item.description,
    created_at: knexInstance.raw('NOW()'),
    last_updated_at: knexInstance.raw('NOW()'),
    project_id: item.project_id,
    vendor_id: vendor.vendor_id, // set Default vendor
    urgent_order_status_id: item.urgent_order_status_id,
    purchase_order_request_item_status_id:
      purchaseOrderRequestItemStatus.purchase_order_request_item_status_id, // set status Requested
  }));

  try {
    await knexInstance('purchase_order_request_item').insert(dataToInsert);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Item Requests added successfully!',
      }),
    };
  } catch (error) {
    console.error('Error in postPurchaseOrderRequestItems:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postItemRequests;