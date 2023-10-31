import VehicleType from './DTO/VehicleType.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  BadRequestError,
  InternalServerError,
  DatabaseError,
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

const postVehicleType = async (body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object') {
    throw new BadRequestError('The vehicleType parameter must be an object');
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

    return createSuccessResponse({
      message: 'Vehicle Type added successfully!',
    });
  } catch (error) {
    console.error('Error in postVehicleType:', error);
    throw new InternalServerError();
  }
};

export default postVehicleType;
