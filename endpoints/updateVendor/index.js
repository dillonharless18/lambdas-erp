import updateVendor from './updateVendor.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).vendorData;
    const vendorId = event.pathParameters?.vendor_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updateVendor(body, vendorId, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
