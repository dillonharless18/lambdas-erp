import CustomerContact from './DTO/CustomerContact.js';
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

const postCustomerContact = async (customerContact, userSub) => {
  await initializeDb();

  if (typeof customerContact != 'object' || customerContact === null) {
    console.error('Error: the customerContact parameter must be an obhect');
    throw new BadRequestError(
      'Invalid input format: The customerContact parameter must be an object'
    );
  }

  try {
    const loggedInUser = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const customerContact = new CustomerContact(customerContact);
    let dataToInsert = {
      last_updated_by: loggedInUser[0],
      created_by: loggedInUser[0],
      ...customerContact,
    };

    await knexInstance('customer_contact').insert(dataToInsert);
    return createSuccessResponse({
      message: 'CustomerContact addedd successfully!',
    });
  } catch (error) {
    console.error(error.stack);
    throw new InternalServerError();
  }
};

export default postCustomerContact;
