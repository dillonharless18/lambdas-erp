import postOcrImportedPurchaseOrder from './postOcrImportedPurchaseOrder.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).ocrImportedPurchaseOrder;

    return await postOcrImportedPurchaseOrder(body);
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export { handler };
