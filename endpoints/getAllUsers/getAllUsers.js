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

const getAllUsers = async (userRole) => {
  await initializeDb();
  try {
    let query = knexInstance
      .select(
        'u.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('user as u')
      .join('user as createdBy', 'createdBy.user_id', '=', 'u.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'u.last_updated_by')
      .orderBy('u.created_at', 'asc');
    if (userRole) {
      query = query
        .where('u.is_active', true)
        .andWhere('u.user_role', userRole);
    }
    const users = await query;

    return createSuccessResponse(users);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new InternalServerError();
  }
};

export default getAllUsers;
