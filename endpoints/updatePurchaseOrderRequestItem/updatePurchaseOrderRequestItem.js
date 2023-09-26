import PurchaseOrderRequestItem from './DTO/PurchaseOrderRequestItem.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  DatabaseError,
  NotFoundError,
  BadRequestError,
} from '/opt/nodejs/errors.js';
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

const updatePurchaseOrderRequestItem = async (
  item,
  purchaseOrderRequestItemId,
  userSub
) => {
  try {
    await initializeDb();

    if (!purchaseOrderRequestItemId) {
      throw new BadRequestError(
        'The purchase_order_request_item_id field must not be null'
      );
    }
    if (typeof item !== 'object' || item === null) {
      console.error('Error: The item parameter must be an object');
      throw new BadRequestError(
        'Invalid input format: The item parameter must be an object'
      );
    }

    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const purchaseOrderRequestItem = new PurchaseOrderRequestItem(item);

    const updatedItem = {
      last_updated_by: user[0],
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
    if (purchaseOrderRequestItem.price)
      updatedItem.price = purchaseOrderRequestItem.price;

    await knexInstance('purchase_order_request_item')
      .where('purchase_order_request_item_id', purchaseOrderRequestItemId)
      .update(updatedItem);

    return createSuccessResponse({
      message: 'Purchase Order Request Item updated successfully!',
    });
  } catch (error) {
    console.error('Error:', error.stack); // Logging error stack
    throw error; // propagate the error to the handler
  }
};

export default updatePurchaseOrderRequestItem;
