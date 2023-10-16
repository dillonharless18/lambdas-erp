import getAllUsers from './getAllUsers.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const userRole = queryParams ? queryParams.role : null;

    return await getAllUsers(userRole);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
