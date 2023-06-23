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

const getTransportationTripComments = async (transportationTripId) => {
  await initializeDb();
  try {
    const getAllTransportationTripComments = await knexInstance
      .select(
        'ttc.transportation_trip_comment_id',
        'ttc.transportation_trip_id',
        'ttc.created_by',
        'ttc.created_at',
        'ttc.comment_text',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('transportation_trip_comment as ttc')
      .join('user', 'ttc.created_by', '=', 'user.user_id')
      .where('ttc.transportation_trip_id', transportationTripId);

    return {
      statusCode: 200,
      body: JSON.stringify(getAllTransportationTripComments),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching Transportation Trip Comments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getTransportationTripComments;
