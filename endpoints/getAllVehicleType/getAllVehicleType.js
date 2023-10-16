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

const getAllVehicleType = async (isAll) => {
  await initializeDb();
  try {
    let query = knexInstance
      .select(
        'vt.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('vehicle_type as vt')
      .join('user as createdBy', 'createdBy.user_id', '=', 'vt.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'vt.last_updated_by')
      .orderBy('vt.created_at', 'asc');

    if (!isAll) {
      query = query.where('vt.is_active', true);
    }
    const vehicleType = await query;
    return createSuccessResponse(vehicleType);
  } catch (error) {
    console.error('Error fetching vehicle type:', error);
    throw new InternalServerError();
  }
};

export default getAllVehicleType;
