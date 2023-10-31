import postCreditCard from './postCreditCard.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body).creaditCard;
    const userSub = event.requestContext.authorizer.sub;

    return await postCreditCard(body, userSub);
  } catch (error) {
    console.error('Error in handler:', error);
    return createErrorResponse(error);
  }
};

export { handler };
