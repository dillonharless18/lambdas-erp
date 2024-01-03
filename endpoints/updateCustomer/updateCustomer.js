import Customer from './DTO/Customer.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  BadRequestError,
  InternalServerError,
  DatabaseError,
  ConflictError,
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

const updateCustomer = async (customerUUID, body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object' || body === null) {
    console.error('Error: The customerData parameter must be an object');
    throw new BadRequestError(
      'Invalid input format: The customerData parameter must be an object'
    );
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const customer = new Customer(body);

  let updatedCustomer = {
    last_updated_by: user[0],
    ...customer,
  };

  updatedCustomer = Object.fromEntries(
    Object.entries(updatedCustomer).filter(
      ([_, val]) => val !== null && val !== undefined && val !== ''
    )
  ); // remove null or empty values

  try {
    await knexInstance('customer')
      .update(updatedCustomer)
      .where('uuid', customerUUID);

    return createSuccessResponse({ message: 'Customer updated successfully!' });
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    throw new InternalServerError();
  }
};

export default updateCustomer;
