import Project from './DTO/Project.js';
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

const updatedProject = async (projectId, body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object' || body === null) {
    console.error('Error: The project parameter must be an object');
    throw new BadRequestError(
      'Invalid input format: The project parameter must be an object'
    );
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const project = new Project(body);

  let updatedProject = {
    last_updated_by: user[0],
    last_updated_at: knexInstance.raw('NOW()'),
    ...project,
  };

  updatedProject = Object.fromEntries(
    Object.entries(updatedProject).filter(
      ([_, val]) => val !== null && val !== undefined && val !== ''
    )
  ); // remove null or empty values

  try {
    await knexInstance('project')
      .update(updatedProject)
      .where('project_id', projectId);

    return createSuccessResponse({ message: 'Project updated successfully!' });
  } catch (error) {
    console.error('Error in updateProject:', error);
    throw new InternalServerError();
  }
};

export default updatedProject;
