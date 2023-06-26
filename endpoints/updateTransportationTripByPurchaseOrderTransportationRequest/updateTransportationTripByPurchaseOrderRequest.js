import TransportationTripByPurchaseOrderRequest from './DTO/TransportationTripByPurchaseOrderRequest.js';
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

const updateTransportationTripByPurchaseOrderRequest = async (data, transportationTripId, purchaseOrderTransportationRequestId) => {
  await initializeDb();

  if (!purchaseOrderTransportationRequestId) {
    throw new Error('The purchase_order_transportation_request_id field must not be null');
  }
  if (!transportationTripId) {
    throw new Error('The transportation_trip_id field must not be null');
  }
  if (typeof data !== 'object' || data === null) {
    console.error('Error: The data parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: The data parameter must be an object',
      }),
    };
  }

  const transportationTripByPurchaseOrderRequest = new TransportationTripByPurchaseOrderRequest(data);

  const updatedData = {
    last_updated_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
    last_updated_at: knexInstance.raw('NOW()'),
    ...transportationTripByPurchaseOrderRequest
  };

  await knexInstance('transportation_trip_by_purchase_order_request')
    .where(
      'transportation_trip_id',
      transportationTripId
    )
    .andWhere('purchase_order_transportation_request_id', purchaseOrderTransportationRequestId)
    .update(updatedData);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transportation Trip By Purchase Order Request updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updateTransportationTripByPurchaseOrderRequest;
