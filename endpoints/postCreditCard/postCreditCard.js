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

const postCreditCard = async (creaditCardData, userSub) => {
  await initializeDb();

  if (typeof creaditCardData !== 'object' || creaditCardData === null) {
    console.error('Error: The creaditCard parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Invalid input format: The creaditCard parameter must be an object',
      }),
    };
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const creditCard = new CreditCard(creaditCardData);

  let dataToInsert = {
    last_updated_by: user[0],
    last_updated_at: knexInstance.raw('NOW()'),
    created_by: user[0],
    created_at: knexInstance.raw('NOW()'),
    is_active: true,
    ...creditCard,
  };

  await knexInstance('credit_card').insert(dataToInsert);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Credit Card added successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default postCreditCard;
