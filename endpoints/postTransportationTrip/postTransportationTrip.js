import TransportationTrip from './DTO/TransportationTrip.js';
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

const postTransportationTrip = async (
  purchaseOrderTransportationRequestId,
  body
) => {
  await initializeDb();

  if (typeof body !== 'object' || body === null || Object.keys(body).length === 0) {
    console.error('Error: The transportation trip parameter must be a non-empty object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Invalid input format: The transportation trip parameter must be a non-empty object',
      }),
    };
  }

  const transportationTrip = new TransportationTrip(body);

  const dataToInsert = {
    transportation_trip_id: uuidv4(),
    driver_id: transportationTrip.driver_id,
    trip_name: transportationTrip.trip_name,
    transportation_trip_status_id: 1, // Assigned
    vehicle_type_id: transportationTrip.vehicle_type_id,
    created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    created_at: knexInstance.raw('NOW()'),
    last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    last_updated_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance.transaction(async (trx) => {
      const transportationTripId = await trx('transportation_trip')
        .insert(dataToInsert)
        .returning('transportation_trip_id');

      await trx(
        'transportation_trip_by_purchase_order_transportation_request'
      ).insert({
        purchase_order_transportation_request_id:
          purchaseOrderTransportationRequestId,
        transportation_trip_id: transportationTripId[0].transportation_trip_id,
        transportation_request_status_id: 2, //Assigned
        created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
        created_at: knexInstance.raw('NOW()'),
        last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
        last_updated_at: knexInstance.raw('NOW()'),
      });

      await trx('purchase_order_transportation_request')
        .update({
          transportation_request_status_id: 2, //Assigned
          last_updated_at: knexInstance.raw('NOW()'),
        })
        .where(
          'purchase_order_transportation_request_id',
          purchaseOrderTransportationRequestId
        );
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transportation Trip added successfully!',
        data: dataToInsert.purchase_order_transportation_request_id,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postTransportationTrip:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postTransportationTrip;
