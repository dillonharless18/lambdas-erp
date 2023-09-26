import getPurchaseOrderRequestItemsComments from './getPurchaseOrderRequestItemComments.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event, context) => {
  try {
    const purchaseOrderRequestItemId =
      event.pathParameters?.purchase_order_request_item_id;
    if (!purchaseOrderRequestItemId) {
      throw new BadRequestError(
        'Missing purchase_order_request_item_id path parameter'
      );
    }
    return await getPurchaseOrderRequestItemsComments(
      purchaseOrderRequestItemId
    );
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
