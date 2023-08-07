import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError, NotFoundError, getHeaders } from './errors.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new DatabaseError('Failed to initialize the database.');
  }
};

const getAllProjects = async () => {
  await initializeDb();
  try {
    const projects = await knexInstance.select('*').from('project');
    if (!projects || projects.length === 0) {
      throw new NotFoundError('No projects found.');
    }
    return {
      statusCode: 200,
      body: JSON.stringify(projects),
      headers: getHeaders(),
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error; // propagate the error to the handler
  }
};

export default getAllProjects;
