import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError, NotFoundError } from '/opt/nodejs/errors.js';
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

const getAllProjects = async () => {
  await initializeDb();
  try {
    // const projects = await knexInstance.select('*').from('project');
    const projects = await knexInstance
      .select(
        'p.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('project as p')
      .join('user as createdBy', 'createdBy.user_id', '=', 'p.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'p.last_updated_by')
      .where('p.is_active', true);

    if (!projects || projects.length === 0) {
      throw new NotFoundError('No projects found.');
    }

    return createSuccessResponse(projects);
  } catch (error) {
    console.error('Error fetching projects:', error.stack); // Logging error stack
    throw error; // propagate the error to the handler
  }
};

export default getAllProjects;
