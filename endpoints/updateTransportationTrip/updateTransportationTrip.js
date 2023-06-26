import TransportationTrip from './DTO/TransportationTrip.js';
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

const updateTransportationTrip = async (body, transportationTripId) => {
  await initializeDb();

  try {
    if (typeof body !== 'object' || body === null) {
      throw new Error(
        'Invalid input format: The transportationTrip parameter must be an object'
      );
    }

    let transportationTripData = new TransportationTrip(body);

    const updatedTransportationTrip = {
      last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Transportation Trip updated successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default updateTransportationTrip;
