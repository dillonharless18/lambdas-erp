import initializeKnex from '/opt/nodejs/db/index.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const getOcrImportedPurchaseOrderComments = async (
  ocr_imported_purchase_order_draft_id
) => {
  await initializeDb();
  try {
    const getAllOcrImportedPurchaseOrderComments = await knexInstance
      .select(
        'ocr_imported_purchase_order_draft_comment.*',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('ocr_imported_purchase_order_draft_comment')
      .join(
        'user',
        'ocr_imported_purchase_order_draft_comment.created_by',
        '=',
        'user.user_id'
      )
      .where(
        'ocr_imported_purchase_order_draft_comment.ocr_imported_purchase_order_draft_id',
        ocr_imported_purchase_order_draft_id
      );

    return {
      statusCode: 200,
      body: JSON.stringify(getAllOcrImportedPurchaseOrderComments),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error(
      'Error fetching OCR Imported Purchase Order Comments:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getOcrImportedPurchaseOrderComments;
