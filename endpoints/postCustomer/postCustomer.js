import Customer from './DTO/Customer.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  DatabaseError,
  BadRequestError,
  InternalServerError,
} from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database', error.stack);
    throw new DatabaseError('Failed to initialize the database.');
  }
};

const postCustomer = async (customerData, userSub) => {
  await initializeDb();

  if (typeof customerData != 'object' || customerData === null) {
    console.error('Error: the customerData parameter must be an obhect');
    throw new BadRequestError(
      'Invalid input format: The customerData parameter must be an object'
    );
  }

  try {
    const loggedInUser = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const customer = new Customer(customerData);
    let dataToInsert = {
      last_updated_by: loggedInUser[0],
      created_by: loggedInUser[0],
      last_updated_at: knexInstance.raw('NOW()'),
      created_at: knexInstance.raw('NOW()'),
      ...customer,
    };

    await knexInstance('customer').insert(dataToInsert);
    return createSuccessResponse({ message: 'Customer addedd successfully!' });
  } catch (error) {
    console.error(error.stack);
    throw new InternalServerError();
  }
};
