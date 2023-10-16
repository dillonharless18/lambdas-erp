import initializeKnex from '/opt/nodejs/db/index.js';
import { InternalServerError, DatabaseError } from '/opt/nodejs/errors.js';
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

const getTransportationTrips = async (transportationTripStatus, isAll) => {
  await initializeDb();
  try {
    let query = knexInstance('transportation_trip')
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
        knexInstance.raw(
          '(SELECT count(*) FROM public.transportation_trip_by_purchase_order_transportation_request WHERE transportation_trip_id = transportation_trip.transportation_trip_id AND is_active = true) as totalStops'
        ),
        knexInstance.raw(
          'COALESCE(comments.comment_count::INTEGER, 0) as comment_count'
        ),
      ])
      .leftJoin(
        knexInstance('transportation_trip_comment')
          .select('transportation_trip_id')
          .count('* as comment_count')
          .groupBy('transportation_trip_id')
          .as('comments'),
        'comments.transportation_trip_id',
        '=',
        'transportation_trip.transportation_trip_id'
      )
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
      .orderBy('transportation_trip.created_at', 'asc');

    if (!isAll) {
      query = query.where('transportation_trip.is_active', true);
    }

    if (transportationTripStatus) {
      let transportaionTripStatusID = await knexInstance(
        'transportation_trip_status'
      )
        .select('transportation_trip_status_id')
        .where('transportation_trip_status_name', transportationTripStatus)
        .first();

      query = query.andWhere(
        'transportation_trip.transportation_trip_status_id',
        transportaionTripStatusID.transportation_trip_status_id
      );
    }

    const transportationTrips = await query;

    return createSuccessResponse(transportationTrips);
  } catch (error) {
    console.error('Error fetching Transportation Trips', error);
    throw new InternalServerError();
  }
};
export default getTransportationTrips;
