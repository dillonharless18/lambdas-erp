import getPurchaseOrderRequestItems from './getPurchaseOrderRequestItems.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const status = queryParams.status;
    const itemName = queryParams?.itemName;
    const urgentOrderStatus = queryParams?.urgentOrderStatus;
    const vendor = queryParams?.vendor;
    const pageNumber = queryParams.pageNumber;
    const userSub = queryParams.userSub;
    if (!status) {
      throw new BadRequestError('Missing status path parameter');
    }
    return await getPurchaseOrderRequestItems(
      status,
      userSub,
      itemName,
      urgentOrderStatus,
      vendor,
      pageNumber
    );
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
