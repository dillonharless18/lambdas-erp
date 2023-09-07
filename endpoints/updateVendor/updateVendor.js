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

const updateVendor = async (vendorData, vendorId, userSub) => {
  await initializeDb();

  if (!vendorId) {
    throw new Error('The vendor_id field must not be null');
  }
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

  if (vendor.payment_terms === 'Net 30') {
    vendor.is_net_vendor = true;
  }

  let updatedVendor = {
    last_updated_by: loggedInUser[0],
    last_updated_at: knexInstance.raw('NOW()'),
    ...vendor,
  };

  updatedVendor = Object.fromEntries(
    Object.entries(updatedVendor).filter(
      ([_, val]) => val !== null && val !== undefined && val !== ''
    )
  ); // remove null or empty values

  await knexInstance('vendor').where('vendor_id', vendorId).update(updatedVendor);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'vendor updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default updateVendor;
