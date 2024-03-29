import ItemRequest from './DTO/ItemRequests.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  DatabaseError,
  BadRequestError,
  InternalServerError,
} from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';
import { v4 as uuidv4 } from 'uuid';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new DatabaseError('Failed to initialize the database.');
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

    return 2; // Purchased
  } catch (error) {
    console.error('Error fetching net vendor status:', error.stack);
    throw error;
  }
};

const postItemRequests = async (items, userSub, bypassRequestWorkspace) => {
  await initializeDb();

  if (!Array.isArray(items)) {
    throw new BadRequestError('The items parameter must be an array');
  }

  let purchaseOrderRequestItemStatus = [];
  if (bypassRequestWorkspace) {
    purchaseOrderRequestItemStatus = await purchaseOrderItemStatusAgainstVendor(
      items[0].vendor
    );
  } else {
    [purchaseOrderRequestItemStatus] = await knexInstance(
      'purchase_order_request_item_status'
    )
      .pluck('purchase_order_request_item_status_id')
      .where('purchase_order_request_item_status_name', 'Requested')
      .andWhere('is_active', true);
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const vendor = await knexInstance('vendor')
    .select('vendor_id')
    .where('vendor_name', 'Default')
    .andWhere('is_active', true)
    .first();

  const purchaseOrderItems = items.map((item) => new ItemRequest(item));

  const dataToInsert = purchaseOrderItems.map((item) => ({
    purchase_order_request_item_id: uuidv4(),
    created_by: user[0],
    last_updated_by: user[0],
    item_name: item.item_name,
    price: item.price ? item.price : '0',
    quantity: item.quantity,
    unit_of_measure: item.unit_of_measure,
    suggested_vendor: item.suggested_vendor,
    s3_uri: item.s3_uri,
    description: item.description,
    created_at: knexInstance.raw('NOW()'),
    last_updated_at: knexInstance.raw('NOW()'),
    project_id: item.project_id,
    vendor_id: item.vendor ? item.vendor : vendor.vendor_id, // check if item.vendor_id is not null/empty, if null/empty then assign default vendor
    in_hand_date: item.in_hand_date,
    urgent_order_status_id: item.urgent_order_status_id,
    purchase_order_request_item_status_id: purchaseOrderRequestItemStatus,
  }));

  try {
    await knexInstance('purchase_order_request_item').insert(dataToInsert);

    return createSuccessResponse({
      message: 'Item Requests added successfully!',
    });
  } catch (error) {
    console.error('Error in postPurchaseOrderRequestItems:', error);
    throw new InternalServerError();
  }
};

export default postItemRequests;
