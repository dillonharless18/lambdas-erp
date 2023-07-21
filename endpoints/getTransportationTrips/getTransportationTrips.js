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

const getTransportationTrips = async (transportationTripStatus) => {
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
      .where('transportation_trip.is_active', true);

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

    return {
      statusCode: 200,
      body: JSON.stringify(transportationTrips),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching Transportation Trips', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Server Error, ${error}`,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
export default getTransportationTrips;
