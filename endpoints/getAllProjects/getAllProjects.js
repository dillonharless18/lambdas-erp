import initializeKnex from '/opt/nodejs/db/index.js';
import {
  DatabaseError,
  NotFoundError,
  InternalServerError,
} from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';

let knexInstance;

const initializeDb = async () => {
  if (!knexInstance) {
    try {
      knexInstance = await initializeKnex();
    } catch (error) {
      console.error('Error initializing database:', error.stack);
      throw new DatabaseError('Failed to initialize the database.');
    }
  }
};

const getAllProjects = async (isAll) => {
  await initializeDb();
  try {
    let query = knexInstance
      .select(
        'p.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        ),
        'c.customer_name as customerName',
        'c.uuid as customerUUID'
      )
      .from('project as p')
      .orderBy('p.created_at', 'asc')
      .join('user as createdBy', 'createdBy.user_id', '=', 'p.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'p.last_updated_by')
      .join('customer as c', 'c.customer_id', '=','p.customer_id');

    if (!isAll) {
      query = query.where('p.is_active', true);
    }
    const projects = await query;

    return createSuccessResponse(projects);
  } catch (error) {
    console.error('Error fetching projects:', error.stack);
    throw new InternalServerError();
  }
};

export default getAllProjects;
