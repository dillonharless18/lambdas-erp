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

const getPurchaseOrderTransportationComments = async (
  purchaseOrderTransportationRequestId
) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderTransportationRequestComments = await knexInstance
      .select(
        'purchase_order_transportation_request_comment.purchase_order_transportation_request_comment_id',
        'purchase_order_transportation_request_comment.purchase_order_transportation_request_id',
        'purchase_order_transportation_request_comment.created_by',
        'purchase_order_transportation_request_comment.created_at',
        'purchase_order_transportation_request_comment.comment_text',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('purchase_order_transportation_request_comment')
      .join(
        'user',
        'purchase_order_transportation_request_comment.created_by',
        '=',
        'user.user_id'
      )
      .where(
        'purchase_order_transportation_request_comment.purchase_order_transportation_request_id',
        purchaseOrderTransportationRequestId
      );

    return {
      statusCode: 200,
      body: JSON.stringify(getAllPurchaseOrderTransportationRequestComments),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error(
      'Error fetching Purchase Order Transportation Request Comments:',
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

export default getPurchaseOrderTransportationComments;
