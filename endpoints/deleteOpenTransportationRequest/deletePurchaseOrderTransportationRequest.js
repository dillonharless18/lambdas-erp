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

const deletepurchaseOrderTransportationRequest = async (
  purchaseOrderTransportationRequestId
) => {
  await initializeDb();

  try {
    await knexInstance('purchase_order_transportation_request')
      .where(
        'purchase_order_transportation_request_id',
        purchaseOrderTransportationRequestId
      )
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Purchase Order Transportation Request deleted successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in deletePurchaseOrderTransportationRequest:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error.message}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
export default deletepurchaseOrderTransportationRequest;
