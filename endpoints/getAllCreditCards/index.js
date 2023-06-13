import getAllCreditCards from './getAllCreaditCards.js';

const handler = async (event, context) => {
  try {
    return await getAllCreditCards();
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
