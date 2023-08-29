import postItemRequests from './postItemRequests.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItems;
    const userSub = event.requestContext.authorizer.sub;

    return await postItemRequests(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
