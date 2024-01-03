import updateCustomer from './updateCustomer.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const customerUUID = event.pathParameters?.customerUUID;
    const body = JSON.parse(event.body).customerData;
    const userSub = event.requestContext.authorizer.sub;

    return await updateCustomer(customerUUID, body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
