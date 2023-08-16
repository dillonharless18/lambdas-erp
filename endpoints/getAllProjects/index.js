import getAllProjects from './getAllProjects.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event, context) => {
  try {
    return await getAllProjects();
  } catch (error) {
    console.error('Error in handler:', error.stack); // Logging error stack
    return createErrorResponse(error);
  }
};

export { handler };
