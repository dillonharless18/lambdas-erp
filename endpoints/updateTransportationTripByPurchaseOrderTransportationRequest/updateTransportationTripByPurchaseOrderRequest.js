import TransportationTripByPurchaseOrderRequest from './DTO/TransportationTripByPurchaseOrderRequest.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  InternalServerError,
  DatabaseError,
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

const updateTransportationTripByPurchaseOrderRequest = async (
  data,
  transportationTripId,
  purchaseOrderTransportationRequestId,
  userSub
) => {
  await initializeDb();

  try {
    if (!purchaseOrderTransportationRequestId) {
      throw new BadRequestError(
        'The purchase_order_transportation_request_id field must not be null'
      );
    }
    if (!transportationTripId) {
      throw new BadRequestError(
        'The transportation_trip_id field must not be null'
      );
    }
    if (typeof data !== 'object' || data === null) {
      console.error('Error: The data parameter must be an object');
      throw new BadRequestError(
        'Invalid input format: The data parameter must be an object'
      );
    }

    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const transportationTripByPurchaseOrderRequest =
      new TransportationTripByPurchaseOrderRequest(data);

    const updatedData = {
      last_updated_by: user[0],
      last_updated_at: knexInstance.raw('NOW()'),
      ...transportationTripByPurchaseOrderRequest,
    };

    await knexInstance(
      'transportation_trip_by_purchase_order_transportation_request'
    )
      .where('transportation_trip_id', transportationTripId)
      .andWhere(
        'purchase_order_transportation_request_id',
        purchaseOrderTransportationRequestId
      )
      .update(updatedData);

    return createSuccessResponse({
      message:
        'Transportation Trip By Purchase Order Request updated successfully!',
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
};

export default updateTransportationTripByPurchaseOrderRequest;
