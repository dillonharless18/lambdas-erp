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

const updateCreditCard = async (creditCardData, creditCardId, userSub) => {
  await initializeDb();

  try {
    if (!creditCardId) {
      throw new BadRequestError('The credit_card_id field must not be null');
    }
    if (typeof creditCardData !== 'object' || creditCardData === null) {
      console.error('Error: The creditCard parameter must be an object');
      throw new BadRequestError(
        'Invalid input format: The creditCard parameter must be an object'
      );
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

    return createSuccessResponse({
      message: 'credit card updated successfully!',
    });
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
};

export default updateCreditCard;
