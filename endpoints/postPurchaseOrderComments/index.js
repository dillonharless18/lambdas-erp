import postPurchaseOrderComment from './postPurchaseOrderComment.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body);
    return await postPurchaseOrderComment(comment);
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
