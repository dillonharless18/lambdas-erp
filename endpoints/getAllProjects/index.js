import getAllProjects from './getAllProjects.js';
import createErrorResponse from './apiResponseUtil.js';

const handler = async (event, context) => {
  try {
    return await getAllProjects();
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(createErrorResponse);
  }
};

export { handler };
