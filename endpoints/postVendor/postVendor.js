import Vendor from './DTO/Vendor.js';
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

const postVendor = async (vendorData, userSub) => {
  await initializeDb();

  if (typeof vendorData !== 'object' || vendorData === null) {
    console.error('Error: The vendorData parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: The vendorData parameter must be an object',
      }),
    };
  }

  const loggedInUser = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const vendor = new Vendor(vendorData);

  let dataToInsert = {
    last_updated_by: loggedInUser[0],
    last_updated_at: knexInstance.raw('NOW()'),
    created_by: loggedInUser[0],
    created_at: knexInstance.raw('NOW()'),
    ...vendor
  };

  await knexInstance('vendor')
    .insert(dataToInsert);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Vendor added successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default postVendor;