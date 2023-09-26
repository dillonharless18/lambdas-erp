import getAllCreditCards from './getAllCreaditCards.js';
import { createErrorResponse } from '/opt/nodejs/apiResponseUtil.js';

const handler = async (event, context) => {
  try {
    return await getAllCreditCards();
  } catch (error) {
    console.error('Error in handler:', error.stack);
    return createErrorResponse(error);
  }
};

export { handler };
