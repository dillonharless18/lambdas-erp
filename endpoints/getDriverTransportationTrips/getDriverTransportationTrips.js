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

const getDriverTransportationTrips = async (cognitoSub) => {
  if (!cognitoSub) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: No cognito_sub provided',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  await initializeDb();
  try {
    const loggedInUser = await knexInstance('user')
      .where('cognito_sub', cognitoSub)
      .pluck('user_id');

    const trips = await knexInstance('transportation_trip as trip')
      .join(
        'transportation_trip_by_purchase_order_transportation_request as po_request',
        'trip.transportation_trip_id',
        '=',
        'po_request.transportation_trip_id'
      )
      .join(
        'purchase_order_transportation_request as request',
        'request.purchase_order_transportation_request_id',
        '=',
        'po_request.purchase_order_transportation_request_id'
      )
      .leftJoin(
        'user as user_created_trip',
        'trip.created_by',
        'user_created_trip.user_id'
      )
      .leftJoin('user as driver', 'trip.driver_id', 'driver.user_id')
      .leftJoin(
        'transportation_trip_status',
        'trip.transportation_trip_status_id',
        'transportation_trip_status.transportation_trip_status_id'
      )
      .leftJoin(
        'vehicle_type',
        'trip.vehicle_type_id',
        'vehicle_type.vehicle_type_id'
      )
      .leftJoin(
        'user as user_created_request',
        'request.created_by',
        'user_created_request.user_id'
      )
      .leftJoin(
        'urgent_order_status as urgent_order_request',
        'request.urgent_order_status_id',
        'urgent_order_request.urgent_order_status_id'
      )
      .leftJoin('project', 'request.project_id', 'project.project_id')
      .leftJoin(
        'transportation_request_type',
        'request.transportation_request_type_id',
        'transportation_request_type.transportation_request_type_id'
      )
      .leftJoin(
        'transportation_request_status',
        'request.transportation_request_status_id',
        'transportation_request_status.transportation_request_status_id'
      )
      .leftJoin(
        'transportation_request_status as trip_by_po_request_status',
        'po_request.transportation_request_status_id',
        'trip_by_po_request_status.transportation_request_status_id'
      )
      .select([
        'trip.transportation_trip_id',
        'trip.created_at',
        'trip.last_updated_at',
        'trip.trip_name',
        'trip.additional_details',
        knexInstance.raw(
          `json_build_object('user_id', user_created_trip.user_id, 'requester', ("user_created_trip".first_name || ' ' || "user_created_trip".last_name)) as created_by`
        ),
        knexInstance.raw(
          `json_build_object('driver_id', driver.user_id, 'driver_name', ("driver".first_name || ' ' || "driver".last_name)) as driver`
        ),
        knexInstance.raw(
          `json_build_object('vehicle_type_id', vehicle_type.vehicle_type_id, 'vehicle_name', vehicle_type.vehicle_type_name) as vehicle`
        ),
        knexInstance.raw(
          `json_build_object('transportation_trip_status_id', transportation_trip_status.transportation_trip_status_id, 'transportation_trip_status_name', transportation_trip_status.transportation_trip_status_name) as transportation_status`
        ),
      ])
      .select(
        knexInstance.raw(`
          json_agg(
            json_build_object(
              'purchase_order_transportation_request_id',request.purchase_order_transportation_request_id,
              'purchase_order_id',request.purchase_order_id,
              'item_name',request.item_name,
              'from_location',request.from_location,
              'to_location',request.to_location,
              'additional_details',request.additional_details,
              'created_at',request.created_at,
              'last_updated_at',request.last_updated_at,
              'future_transportation_date', request.future_transportation_date,
              'transportation_time', request.transportation_time,
              'contact_name', request.contact_name,
              'contact_number', request.contact_number,
              'recipients', request.recipients,
              'created_by', json_build_object('user_id', user_created_request.user_id, 'requester', (user_created_request.first_name || ' ' || user_created_request.last_name)),
              'urgent_order_status',json_build_object('urgent_order_status_id', urgent_order_request.urgent_order_status_id, 'urgent_order_status_name', urgent_order_request.urgent_order_status_name),
              'project', json_build_object('project_id', project.project_id, 'project_name', project.project_name),
              'transportation_request_type', json_build_object('transportation_request_type_id', transportation_request_type.transportation_request_type_id, 'transportation_request_type_name', transportation_request_type.transportation_request_type_name),
              'transportation_request_status', json_build_object('transportation_request_status_id', transportation_request_status.transportation_request_status_id, 'transportation_request_status_name', transportation_request_status.transportation_request_status_name),
              'trip_by_po_request_status', json_build_object('transportation_request_status_id', trip_by_po_request_status.transportation_request_status_id, 'transportation_request_status_name', trip_by_po_request_status.transportation_request_status_name)
            )
          ) as purchase_order_transportation_requests
        `)
      )
      .groupBy(
        'trip.transportation_trip_id',
        'user_created_trip.user_id',
        'driver.user_id',
        'vehicle_type.vehicle_type_id',
        'transportation_trip_status.transportation_trip_status_id'
      )
      .where('trip.driver_id', loggedInUser[0])
      .whereNot('trip_by_po_request_status.transportation_request_status_id', 4)
      .andWhere('trip.is_active', true);

    return {
      statusCode: 200,
      body: JSON.stringify(trips),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching Driver Transportation Trips:', error);
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

export default getDriverTransportationTrips;
