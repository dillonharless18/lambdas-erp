import updateCustomerContact from './updateCustomerContact.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const customerContactUUID = event.pathParameters?.customerContactUUID;
    const body = JSON.parse(event.body).customerContact;
    const userSub = event.requestContext.authorizer.sub;

    return await updateCustomerContact(customerContactUUID, body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
