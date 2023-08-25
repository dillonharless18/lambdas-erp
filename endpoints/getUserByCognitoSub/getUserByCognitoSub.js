import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError, NotFoundError } from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    throw new DatabaseError('Failed to initialize the database.');
  }
};

const getUserByCognitoSub = async (cognitoSub) => {
  if (!cognitoSub) {
    throw new NotFoundError('Invalid input format: No cognito_sub provided');
  }

  await initializeDb();
  try {
    const user = await knexInstance('user')
      .select('*')
      .where('cognito_sub', cognitoSub)
      .andWhere('is_active', true)

    if (!user || user.length === 0) {
      throw new NotFoundError("No active user found with the provided cognito_sub.");
    }

    return createSuccessResponse(user[0])
  } catch (error) {
    throw error
  }
};

export default getUserByCognitoSub;
