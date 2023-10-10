import getOcrImportedPurchaseOrderComments from './getOcrImportedPurchaseOrderComments.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';
import { BadRequestError } from '/opt/nodejs/errors.js';

const handler = async (event, context) => {
  try {
    const ocrImportedOrderId =
      event.pathParameters?.ocr_imported_purchase_order_draft_id;
    if (!ocrImportedOrderId) {
      throw new BadRequestError(
        'Missing ocr_imported_purchase_order_draft_id path parameter'
      );
    }
    return await getOcrImportedPurchaseOrderComments(ocrImportedOrderId);
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse('error');
  }
};

export { handler };
