import deleteOpenTransportationRequest from './deleteOpenTransportationRequest.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event) => {
  try {
    const purchaseOrderTransportationRequestId =
      event.pathParameters?.purchase_order_transportation_request_id;
    if (!purchaseOrderTransportationRequestId) {
      throw new BadRequestError(
        'Missing purchase_order_transportation_request_id path parameter'
      );
    }

    return await deleteOpenTransportationRequest(
      purchaseOrderTransportationRequestId
    );
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
