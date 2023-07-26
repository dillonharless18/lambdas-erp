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

const postProject = async (ProjectId, body, userSub) => {
  await initializeDb();

  if (!Array.isArray(body)) {
    throw new Error('The project parameter must be an array');
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const project = new Project(body);

  const updatedProject = {
    last_updated_by: user[0],
    last_updated_at: knexInstance.raw('NOW()'),
  };

  for (let key of Object.keys(project)) {
    if (project[key]) {
      updatedProject[key] = project[key];
    }
  }

  try {
    await knexInstance('project')
      .update(updatedProject)
      .where('project_id', ProjectId);

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
