import Project from './DTO/Project.js';
import initializeKnex from '/opt/nodejs/db/index.js';

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

const updatedProject = async (ProjectId, body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object' || body === null) {
    console.error('Error: The project parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: The project parameter must be an object',
      }),
    };
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
        message: 'Project updated successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in updateProject:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default updatedProject;
