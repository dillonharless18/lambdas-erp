import CreditCard from './DTO/CreditCard.js';
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

const updateCreditCard = async (creditCardData, creditCardId, userSub) => {
  await initializeDb();

  if (!creditCardId) {
    throw new Error('The credit_card_id field must not be null');
  }
  if (typeof creditCardData !== 'object' || creditCardData === null) {
    console.error('Error: The creditCard parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Invalid input format: The creditCard parameter must be an object',
      }),
    };
  }
  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const creditCard = new CreditCard(creditCardData);

  let updatedCreditCard = {
    last_updated_by: user[0],
    last_updated_at: knexInstance.raw('NOW()'),
    ...creditCard,
  };

  updatedCreditCard = Object.fromEntries(
    Object.entries(updatedCreditCard).filter(
      ([_, val]) => val !== null && val !== undefined && val !== ''
    )
  );

  await knexInstance('credit_card')
    .where('credit_card_id', creditCardId)
    .update(updatedCreditCard);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'credit card updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updateCreditCard;
