import updateProject from './updateProject.js';

const handler = async (event) => {
  try {
    const projectId = event.pathParameters?.project_id;
    const body = JSON.parse(event.body).project;
    const userSub = event.requestContext.authorizer.sub;

    return await updateProject(projectId, body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export { handler };