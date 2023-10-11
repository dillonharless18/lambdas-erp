import PurchaseOrderTransportationRequest from './DTO/PurchaseOrderTransportationRequest.js';
import { DatabaseError, BadRequestError } from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

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

const postPurchaseOrderTransportationRequest = async (body, userSub) => {
  await initializeDb();

  if (!body) {
    throw new BadRequestError('No data provided');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const transportationRequestData = new PurchaseOrderTransportationRequest(
    body
  );

  const dataToInsert = {
    purchase_order_transportation_request_id: uuidv4(),
    transportation_request_type_id: transportationRequestData.purchase_order_id
      ? 1
      : 2, // 1 means PO and 2 means item
    transportation_request_status_id: 1, // means status is Open
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
    last_updated_by: user[0],
    last_updated_at: knexInstance.raw('NOW()'),
    ...transportationRequestData,
  };

  try {
    await knexInstance('purchase_order_transportation_request').insert(
      dataToInsert
    );

    return createSuccessResponse({
      message: 'Purchase Order Transportation Request added successfully!',
      data: dataToInsert.purchase_order_transportation_request_id,
    });
  } catch (error) {
    console.error('Error in postPurchaseOrderTransportationRequest:', error);
    throw error;
  }
};

export default postPurchaseOrderTransportationRequest;
