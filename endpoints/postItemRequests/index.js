import postItemRequests from './postItemRequests.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).requestItems;
    const userSub = event.requestContext.authorizer.sub;
    const isRequestItem = queryParams?.isRequestItem

    return await postItemRequests(body, userSub, isRequestItem);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
