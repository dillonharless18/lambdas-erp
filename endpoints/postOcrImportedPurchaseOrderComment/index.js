import postOcrImportedPurchaseOrderComment from './postOcrImportedPurchaseOrderComment.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    const userSub = event.requestContext.authorizer.sub;
    return await postOcrImportedPurchaseOrderComment(comment, userSub);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
