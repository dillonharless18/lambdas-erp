import Project from './DTO/Project.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const postProject = async (body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object') {
    throw new Error('The project parameter must be an object');
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
    created_by: user[0],
    last_updated_by: user[0],
    created_at: knexInstance.raw('NOW()'),
    last_updated_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('project').insert(dataToInsert);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Project added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postProject:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postProject;
