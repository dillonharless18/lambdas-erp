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

const deleteTransportationTrip = async (transportationTripId) => {
  await initializeDb();

  try {
    await knexInstance.transaction(async (trx) => {
      await trx('transportation_trip')
        .where('transportation_trip_id', transportationTripId)
        .update({
          is_active: false,
          last_updated_at: trx.raw('NOW()'),
          transportation_trip_status_id: 4, //Cancelled
        });

      const purchaseOrderTransportationRequestIds = await trx(
        'transportation_trip_by_purchase_order_transportation_request'
      )
        .where('transportation_trip_id', transportationTripId)
        .update({
          is_active: true,
          last_updated_at: trx.raw('NOW()'),
          transportation_request_status_id: 1, //Open
        })
        .returning('purchase_order_transportation_request_id');

      const ids = purchaseOrderTransportationRequestIds.map(
        (row) => row.purchase_order_transportation_request_id
      );

      await trx('purchase_order_transportation_request')
        .update('transportation_request_status_id', 1)
        .whereIn('purchase_order_transportation_request_id', ids);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transportation Trip deleted successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in deleteTransportationTrip:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error.message}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
export default deleteTransportationTrip;
