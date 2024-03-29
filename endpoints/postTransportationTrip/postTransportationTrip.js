import TransportationTrip from './DTO/TransportationTrip.js';
import {
  InternalServerError,
  DatabaseError,
  BadRequestError,
} from '/opt/nodejs/errors.js';
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

const postTransportationTrip = async (body, userSub) => {
  await initializeDb();

  if (
    typeof body !== 'object' ||
    body === null ||
    Object.keys(body).length === 0
  ) {
    console.error(
      'Error: The transportation trip parameter must be a non-empty object'
    );
    throw new BadRequestError(
      'Invalid input format: The transportation trip parameter must be a non-empty object'
    );
  }
  if (body.purchase_order_transportation_request_ids?.length === 0) {
    throw new BadRequestError(
      'Invalid input format: No data provided in purchase_order_transportation_request_ids'
    );
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const transportationTrip = new TransportationTrip(body);

  const dataToInsert = {
    transportation_trip_id: uuidv4(),
    driver_id: transportationTrip.driver_id,
    trip_name: transportationTrip.trip_name,
    transportation_trip_status_id: 1, // Assigned
    vehicle_type_id: transportationTrip.vehicle_type_id,
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
    last_updated_by: user[0],
    last_updated_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance.transaction(async (trx) => {
      const transportationTripRes = await trx('transportation_trip')
        .insert(dataToInsert)
        .returning('transportation_trip_id');

      const promises =
        transportationTrip.purchase_order_transportation_request_ids.map(
          async (id) => {
            await trx(
              'transportation_trip_by_purchase_order_transportation_request'
            ).insert({
              purchase_order_transportation_request_id: id,
              transportation_trip_id:
                transportationTripRes[0].transportation_trip_id,
              transportation_request_status_id: 2, //Assigned
              created_by: user[0],
              created_at: knexInstance.raw('NOW()'),
              last_updated_by: user[0],
              last_updated_at: knexInstance.raw('NOW()'),
            });

            await trx('purchase_order_transportation_request')
              .update({
                transportation_request_status_id: 2, //Assigned
                last_updated_at: knexInstance.raw('NOW()'),
              })
              .where('purchase_order_transportation_request_id', id);
          }
        );

      await Promise.all(promises);
    });

    const addedTrip = await knexInstance('transportation_trip')
      .select([
        'transportation_trip.*',
        knexInstance.raw(
          "(driver.first_name || ' ' || driver.last_name) as driverName"
        ),
        knexInstance.raw(
          "(requester.first_name || ' ' || requester.last_name) as requester"
        ),
        'transportation_trip_status.transportation_trip_status_name',
        'vehicle_type.vehicle_type_name',
      ])
      .leftJoin(
        'user as driver',
        'transportation_trip.driver_id',
        'driver.user_id'
      )
      .leftJoin(
        'user as requester',
        'transportation_trip.created_by',
        'requester.user_id'
      )
      .leftJoin(
        'transportation_trip_status',
        'transportation_trip.transportation_trip_status_id',
        'transportation_trip_status.transportation_trip_status_id'
      )
      .leftJoin(
        'vehicle_type',
        'transportation_trip.vehicle_type_id',
        'vehicle_type.vehicle_type_id'
      )
      .where('transportation_trip.is_active', true)
      .andWhere(
        'transportation_trip.transportation_trip_id',
        dataToInsert.transportation_trip_id
      );

    return createSuccessResponse({
      message: 'Transportation Trip added successfully!',
      data: addedTrip
    });
  } catch (error) {
    console.error('Error in postTransportationTrip:', error);
    throw new InternalServerError();
  }
};

export default postTransportationTrip;
