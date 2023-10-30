import Vendor from './DTO/Vendor.js';
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

const updateVendor = async (vendorData, vendorId, userSub) => {
  await initializeDb();

  try {
    if (!vendorId) {
      throw new BadRequestError('The vendor_id field must not be null');
    }
    if (typeof vendorData !== 'object' || vendorData === null) {
      console.error('Error: The vendorData parameter must be an object');
      throw new BadRequestError(
        'Invalid input format: The vendorData parameter must be an object'
      );
    }
    const loggedInUser = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const vendor = new Vendor(vendorData);

    if (vendor.payment_terms === 'Net 30') {
      vendor.is_net_vendor = true;
    } else {
      vendor.is_net_vendor = false;
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

    await knexInstance('vendor')
      .where('vendor_id', vendorId)
      .update(updatedVendor);

    return createSuccessResponse({ message: 'vendor updated successfully!' });
  } catch (error) {
    console.error(error.stack);
    throw new InternalServerError();
  }
};

export default updateVendor;
