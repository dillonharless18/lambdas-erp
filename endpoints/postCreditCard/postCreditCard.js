import CreditCard from './DTO/CreditCard.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  BadRequestError,
  InternalServerError,
  DatabaseError,
} from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error.stack);
    throw new DatabaseError('Failed to initialize the database.');
  }
};

const postCreditCard = async (creaditCardData, userSub) => {
  await initializeDb();

  try {
    if (typeof creaditCardData !== 'object' || creaditCardData === null) {
      console.error('Error: The creaditCard parameter must be an object');
      throw new BadRequestError(
        'Invalid input format: The creaditCard parameter must be an object'
      );
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

    return createSuccessResponse({
      message: 'Credit Card added successfully!',
    });
  } catch (error) {
    console.error(error.stack);
    throw new InternalServerError();
  }
};

export default postCreditCard;
