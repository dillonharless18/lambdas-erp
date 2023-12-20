import { createErrorResponse } from "/opt/nodejs/apiResponseUtil.js";
import updateOcrImportedPurchaseOrderItemJobs from "./updateOcrImportedPurchaseOrderItemJobs.js";

const handler = async (event) => {
    try {
        const body = JSON.parse(event.body).ocrImportedPurchaseOrderDraftItems;
        const ocrImporterPurchaseOrderDraftId =
            event.pathParameters?.ocr_imported_purchase_order_draft_id;
        const jobId = event.pathParameters?.job_id;
        const userSub = event.requestContext.authorizer.sub;

        return await updateOcrImportedPurchaseOrderItemJobs(
            ocrImporterPurchaseOrderDraftId,
            jobId,
            body,
            userSub
        );
    } catch (error) {
        console.error("Error in handler: ", error.stack);
        return createErrorResponse(error);
    }
};

export { handler };
