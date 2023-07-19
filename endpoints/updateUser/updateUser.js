import User from './DTO/User.js';
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

const updateUser = async (userData, userId) => {
  await initializeDb();

  if (!userId) {
    throw new Error('The user_id field must not be null');
  }
  if (typeof userData !== 'object' || userData === null) {
    console.error('Error: The userData parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: The userData parameter must be an object',
      }),
    };
  }

  const user = new User(userData);

  let updatedUser = {
    last_updated_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
    last_updated_at: knexInstance.raw('NOW()'),
    ...user
  };

  updatedUser = Object.fromEntries(
    Object.entries(updatedUser).filter(([_, val]) => val !== null && val !== undefined && val !== "")
  ); // remove null or empty values

  await knexInstance('user')
    .where('user_id', userId)
    .update(updatedUser);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'user updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updateUser;
