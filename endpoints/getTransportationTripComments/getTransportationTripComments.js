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

    return createSuccessResponse(getAllTransportationTripComments);
  } catch (error) {
    console.error('Error fetching Transportation Trip Comments:', error);
    throw new InternalServerError();
  }
};

export default getTransportationTripComments;
