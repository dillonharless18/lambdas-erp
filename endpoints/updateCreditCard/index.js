import updateCreditCard from './updateCreditCard.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).creditCard;
    const creditCardId = event.pathParameters?.credit_card_id;
    const userSub = event.requestContext.authorizer.sub;

    return await updateCreditCard(body, creditCardId, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
