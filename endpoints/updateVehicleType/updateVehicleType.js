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

const updateVehicleType = async (vehicleTypeId, body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object') {
    throw new BadRequestError('The vehicleType parameter must be an object');
  }

  try {
    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const vehicleType = new VehicleType(body);

    let updatedVehicleType = {
      last_updated_by: user[0],
      last_updated_at: knexInstance.raw('NOW()'),
      ...vehicleType,
    };

    updatedVehicleType = Object.fromEntries(
      Object.entries(updatedVehicleType).filter(
        ([_, val]) => val !== null && val !== undefined && val !== ''
      )
    ); // remove null or empty values

    await knexInstance('vehicle_type')
      .where('vehicle_type_id', vehicleTypeId)
      .update(updatedVehicleType);

    return createSuccessResponse({
      message: 'Vehicle type updated successfully!',
    });
  } catch (error) {
    console.error('Error in updateVehicleType:', error);
    throw new InternalServerError();
  }
};

export default updateVehicleType;
