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

const getAllUsers = async (userRole) => {
  await initializeDb();
  try {
    let query = knexInstance.select('*').from('user').where('is_active', true);
    if (userRole) {
      query = query.andWhere('user_role', userRole);
    }
    const users = await query;

    return {
      statusCode: 200,
      body: JSON.stringify(users),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default getAllUsers;
