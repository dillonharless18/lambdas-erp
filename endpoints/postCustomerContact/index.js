import postCustomerContact from './postCustomerContact.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const customerId = event.pathParameters?.customer_id;
    const body = JSON.parse(event.body).customerContact;
    const userSub = event.requestContext.authorizer.sub;

    return await postCustomerContact(body, customerId, userSub);
  } catch (error) {
    console.error(error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
