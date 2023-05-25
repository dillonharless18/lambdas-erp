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

const getPurchaseOrderRequestItemsComments = async (
  purchaseOrderRequestItemId
) => {
  await initializeDb();
  try {
    const getAllPurchaseOrderRequestItemComments = await knexInstance
      .select(
        'purchase_order_request_item_comment.*',
        knexInstance.raw(
          '("user".first_name || \' \' || "user".last_name) AS requester'
        )
      )
      .from('purchase_order_request_item_comment')
      .join(
        'user',
        'purchase_order_request_item_comment.created_by',
        '=',
        'user.user_id'
      )
      .where(
        'purchase_order_request_item_comment.purchase_order_request_item_id',
        purchaseOrderRequestItemId
      );

    return {
      statusCode: 200,
      body: JSON.stringify(getAllPurchaseOrderRequestItemComments),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error(
      'Error fetching Purchase Order Request Item Comments:',
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

export default getPurchaseOrderRequestItemsComments;
