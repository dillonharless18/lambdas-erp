import initializeKnex from "/opt/nodejs/db/index.js";
import { createSuccessResponse } from "/opt/nodesjs/api/apiResponseUtil.js";
import {
    DatabaseError,
    BadRequestError,
    InternalServerError,
} from "/opt/nodejs/errors.js";

let knexInstance;

const initializeDb = async () => {
    try {
        if (!knexInstance) {
            knexInstance = await initializeKnex();
        }
    } catch (error) {
        console.error("Error initializing database:", error.stack);
        throw new DatabaseError("failed to initialize the database.");
    }
};

const updateOcrImportedPurchaseOrderItemJobs = async (
    ocrImportedPurchaseOrderId,
    jobId,
    ocrImportedPurchaseOrderDraft,
    userSub
) => {
    await initializeDb();

    if (!Array.isArray(ocrImportedPurchaseOrderDraft)) {
        throw new BadRequestError(
            "The ocrImportedPurchaseOrderDraft must be an array"
        );
    }
    if (!ocrImportedPurchaseOrderId) {
        throw new BadRequestError(
            "Missing ocr_imported_purchase_order_id path parameter"
        );
    }
    if (!jobId) {
        throw new BadRequestError("Missing job_id path parameter");
    }

    try {
        const user = await knexInstance("user")
            .where("cognito_sub", userSub)
            .pluck("user_id");

        const ocrImportedPurchaseOrderDraftItemIds =
            ocrImportedPurchaseOrderDraft.map(
                (item) => item.ocr_imported_purchase_order_draft_item_id
            );

        const updatedOcrImportedPODraftItemJobs = await knexInstance(
            "ocr_imported_purchase_order_draft_item"
        )
            .update({
                project_id: jobId,
                last_updated_at: knexInstance.raw("NOW()"),
                last_updated_by: user[0],
            })
            .where(
                "ocr_imported_purchase_order_draft_id",
                ocrImportedPurchaseOrderId
            )
            .whereIn(
                "ocr_imported_purchase_order_draft_item_id",
                ocrImportedPurchaseOrderDraftItemIds
            )
            .returning("*");

        return createSuccessResponse({
            message:
                "Ocr Imported Purchase Order Draft Item(s) Job Updated Successfully",
            data: updatedOcrImportedPODraftItemJobs,
        });
    } catch (error) {
        console.error(
            "Error in updateOcrImportedPurchaseOrderItemJobs",
            error.stack
        );
        throw new InternalServerError();
    }
};

export default updateOcrImportedPurchaseOrderItemJobs;
