import postCustomer from './postCustomer.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).customerData;
    const userSub = event.requestContext.authorizer.sub;

    return await postCustomer(body, userSub);
  } catch (error) {
    console.error(error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
