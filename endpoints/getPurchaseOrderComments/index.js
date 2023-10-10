import getPurchaseOrderComments from './getPurchaseOrderComments.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event, context) => {
  try {
    const purchaseOrderId = event.pathParameters?.purchase_order_id;
    if (!purchaseOrderId) {
      throw new BadRequestError('Missing purchase_order_id path parameter');
    }
    return await getPurchaseOrderComments(purchaseOrderId);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
