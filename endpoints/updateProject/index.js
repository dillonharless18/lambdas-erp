import updateProject from './updateProject.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const projectId = event.pathParameters?.project_id;
    const body = JSON.parse(event.body).project;
    const userSub = event.requestContext.authorizer.sub;

    return await updateProject(projectId, body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
