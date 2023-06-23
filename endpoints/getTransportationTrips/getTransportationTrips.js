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
        'transportation_trip_status.transportation_trip_status_name',
        'vehicle_type.vehicle_type_name',
      ])
      .leftJoin(
        'user as driver',
        'transportation_trip.driver_id',
        'driver.user_id'
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
      );

    if (transportationTripStatus) {
      let transportaionTripStatusID = await knexInstance(
        'transportation_trip_status'
      )
        .select('transportation_trip_status_id')
        .where('transportation_trip_status_name', transportationTripStatus);

      query = query.where(
        'transportation_trip_status_id',
        transportaionTripStatusID
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
    };
  }
};

export default getTransportationTrips;
