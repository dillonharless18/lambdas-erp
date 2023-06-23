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
    await knexInstance('transportation_trip')
      .where('transportation_trip_id', transportationTripId)
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
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
