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

const deleteNetVendorRequestItem = async (netVendorRequestItemId) => {
  await initializeDb();

  try {
    await knexInstance('purchase_order_request_item')
      .where('purchase_order_request_item_id', netVendorRequestItemId)
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Net Vendor Request Item deleted successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in deletePurchaseOrderRequestItem:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error.message}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
export default deleteNetVendorRequestItem;
