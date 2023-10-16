import postPurchaseOrderTransportationRequestComment from './postPurchaseOrdertransportationRequestComment.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    const purchaseOrderTransportationRequestId =
      event.pathParameters?.purchase_order_transportation_request_id;
    const userSub = event.requestContext.authorizer.sub;

    if (!purchaseOrderTransportationRequestId) {
      throw new BadRequestError(
        'Missing purchase_order_transportation_request_id path parameter'
      );
    }

    return await postPurchaseOrderTransportationRequestComment(
      comment,
      purchaseOrderTransportationRequestId,
      userSub
    );
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
