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

const deletePurchaseOrderRequestItems = async (requestBody) => {
  await initializeDb();

  if (
    !requestBody ||
    !requestBody.requestItems ||
    !Array.isArray(requestBody.requestItems)
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }

  try {
    const ids = requestBody.requestItems.map((item) => item.id);

    await knexInstance('purchase_order_request_item')
      .whereIn('purchase_order_request_item_id', ids)
      .update({
        is_active: false,
        last_updated_at: knexInstance.fn.now(),
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Purchase Order Request Items deleted successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postPurchaseOrderRequestItems:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error.message}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
export default deletePurchaseOrderRequestItems;
