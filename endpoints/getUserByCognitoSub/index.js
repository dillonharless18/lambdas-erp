import getUserByCognitoSub from './getUserByCognitoSub.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const cognitoSub = event.requestContext.authorizer.sub;
    return await getUserByCognitoSub(cognitoSub);
  } catch (error) {
    return createErrorResponse(error)
  }
};

export { handler };
