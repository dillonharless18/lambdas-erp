import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError, NotFoundError } from '/opt/nodejs/errors.js';
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

const getAllVendors = async () => {
  await initializeDb();
  try {
    const allVendors = await knexInstance
      .select(
        'v.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('vendor as v')
      .join('user as createdBy', 'createdBy.user_id', '=', 'v.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'v.last_updated_by')
      .where('v.is_active', true);
    return createSuccessResponse(allVendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

export default getAllVendors;
