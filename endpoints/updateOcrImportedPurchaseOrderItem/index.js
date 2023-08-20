import updateOcrImportedPurchaseOrderItem from './updateOcrImportedPurchaseOrderItem.js';
import {
  createErrorResponse,
  NotFoundError,
} from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const ocrImportedPurchaseOrderDraftItemId =
      event.pathParameters?.ocr_imported_purchase_order_draft_id;
    const body = JSON.parse(event.body).ocrImportedPurchaseOrderItem;
    const userSub = event.requestContext.authorizer.sub;

    if (!ocrImportedPurchaseOrderDraftItemId) {
      throw new NotFoundError(
        'Missing ocrImportedPurchaseOrderItemId path parameter'
      );
    }

    return await updateOcrImportedPurchaseOrderItem(
      ocrImportedPurchaseOrderDraftItemId,
      body,
      userSub
    );
  } catch (error) {
    // console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
