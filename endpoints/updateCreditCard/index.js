import updateCreditCard from './updateCreditCard.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).creditCard;
    const creditCardId = event.pathParameters?.credit_card_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updateCreditCard(body, creditCardId, userSub);
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
