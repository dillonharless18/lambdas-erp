import deleteCustomerContact from './deleteCustomerContact.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const customerContactUUID = event.pathParameters?.customerContactUUID;
    const userSub = event.requestContext.authorizer.sub;

    if (!customerContactUUIDv) {
      throw new BadRequestError('Missing customerContactUUID path parameter');
    }

    return await deleteCustomerContact(customerContactUUID, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
