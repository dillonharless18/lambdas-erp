import postOcrImportedPurchaseOrderComment from './postOcrImportedPurchaseOrderComment.js';

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    return await postOcrImportedPurchaseOrderCommentf(comment);
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
