import VehicleType from './DTO/VehicleType.js';
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

const postVehicleType = async (body, userSub) => {
  await initializeDb();

  if (!Array.isArray(body)) {
    throw new Error('The vehicleType parameter must be an array');
  }

  try {
    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const vehicleType = new VehicleType(body);

    const dataToInsert = {
      vehicle_type_name: vehicleType.vehicle_type_name,
      is_active: true,
      created_by: user[0],
      last_updated_by: user[0],
      created_at: knexInstance.raw('NOW()'),
      last_updated_at: knexInstance.raw('NOW()'),
    };
    await knexInstance('vehicle_type').insert(dataToInsert);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Vehicle Type added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postVehicleType:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postVehicleType;
