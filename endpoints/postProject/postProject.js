import Project from './DTO/Project.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';
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

const postProject = async (body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object') {
    throw new BadRequestError('The project parameter must be an object');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const project = new Project(body);

  const dataToInsert = {
    project_name: project.project_name,
    is_active: true,
    project_code: project.project_code,
    material_budget: project.material_budget,
    labor_budget: project.labor_budget,
    customer_id: project.customer_id,
    created_by: user[0],
    last_updated_by: user[0],
    created_at: knexInstance.raw('NOW()'),
    last_updated_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('project').insert(dataToInsert);

    return createSuccessResponse({ message: 'Project added successfully!' });
  } catch (error) {
    console.error('Error in postProject:', error);
    throw new InternalServerError();
  }
};

export default postProject;
