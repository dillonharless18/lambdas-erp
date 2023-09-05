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

const updateVehicleType = async (vehicleTypeId, body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object') {
    throw new Error('The vehicleType parameter must be an object');
  }

  try {
    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const vehicleType = new VehicleType(body);

    let updatedVehicleType = {
      last_updated_by: user[0],
      last_updated_at: knexInstance.raw('NOW()'),
      ...vehicleType
    };

    updatedVehicleType = Object.fromEntries(
      Object.entries(updatedVehicleType).filter(
        ([_, val]) => val !== null && val !== undefined && val !== ''
      )
    ); // remove null or empty values

    await knexInstance('vehicle_type')
      .where('vehicle_type_id', vehicleTypeId)
      .update(updatedVehicleType);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Vehicle type updated successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in updateVehicleType:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default updateVehicleType;
