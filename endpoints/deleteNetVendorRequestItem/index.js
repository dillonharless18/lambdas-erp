import deleteNetVendorRequestItem from './deleteNetVendorRequestItem.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const netVendorRequestItemId =
      event.pathParameters?.net_vendor_request_item_id;

    if (!netVendorRequestItemId) {
      return BadRequestError(
        'Missing net_vendor_request_item_id path parameter'
      );
    }

    return await deleteNetVendorRequestItem(netVendorRequestItemId);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
