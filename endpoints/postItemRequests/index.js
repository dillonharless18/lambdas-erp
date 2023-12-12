import postItemRequests from './postItemRequests.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItems;
    const userSub = event.requestContext.authorizer.sub;
    const queryParams = event.queryStringParameters;
    const bypassRequestWorkspace = queryParams?.bypassRequestWorkspace

    return await postItemRequests(body, userSub, bypassRequestWorkspace);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
