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

const getPurchaseOrderComments = async (
  purchaseOrderId
) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderComments = await knexInstance
      .select(
        'purchase_order_comment.purchase_order_comment_id',
        "purchase_order_comment.purchase_order_id",
        "purchase_order_comment.created_by",
        "purchase_order_comment.created_at",
        "purchase_order_comment.comment_text",
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('purchase_order_comment')
      .join(
        'user',
        'purchase_order_comment.created_by',
        '=',
        'user.user_id'
      )
      .where(
        'purchase_order_comment.purchase_order_id',
        purchaseOrderId
      );

    return {
      statusCode: 200,
      body: JSON.stringify(getAllPurchaseOrderComments),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error(
      'Error fetching Purchase Order Comments:',
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

export default getPurchaseOrderComments;
