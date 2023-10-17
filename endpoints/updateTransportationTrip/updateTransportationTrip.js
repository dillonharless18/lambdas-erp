import TransportationTrip from './DTO/TransportationTrip.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  InternalServerError,
  DatabaseError,
  BadRequestError,
} from '/opt/nodejs/errors.js';
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

const updateTransportationTrip = async (
  body,
  transportationTripId,
  userSub
) => {
  await initializeDb();

  try {
    if (typeof body !== 'object' || body === null) {
      throw new BadRequestError(
        'Invalid input format: The transportationTrip parameter must be an object'
      );
    }

    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    let transportationTripData = new TransportationTrip(body);

    const updatedTransportationTrip = {
      last_updated_by: user[0],
      last_updated_at: knexInstance.raw('NOW()'),
    };

    for (let key of Object.keys(transportationTripData)) {
      if (transportationTripData[key]) {
        updatedTransportationTrip[key] = transportationTripData[key];
      }
    }

    await knexInstance('transportation_trip')
      .where('transportation_trip_id', transportationTripId)
      .update(updatedTransportationTrip);

    return createSuccessResponse({
      message: 'Transportation Trip updated successfully!',
    });
  } catch (error) {
    console.error('Error:', error.message);
    throw new InternalServerError();
  }
};

export default updateTransportationTrip;
