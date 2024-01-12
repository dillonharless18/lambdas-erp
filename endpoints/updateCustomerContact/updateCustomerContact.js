import CustomerContact from './DTO/CustomerContact.js';
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

const updateCustomerContact = async (customerContactUUID, body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object' || body === null) {
    console.error('Error: The customerContact parameter must be an object');
    throw new BadRequestError(
      'Invalid input format: The customerContact parameter must be an object'
    );
  }

  const user = await knexInstance('user')
    .where('cognito_sub', userSub)
    .pluck('user_id');

  const customerContact = new CustomerContact(body);

  let updatedCustomerContact = {
    last_updated_by: user[0],
    ...customerContact,
  };

  updatedCustomerContact = Object.fromEntries(
    Object.entries(updatedCustomerContact).filter(
      ([_, val]) => val !== null && val !== undefined && val !== ''
    )
  );

  try {
    await knexInstance('customer_contact')
      .update(updatedCustomerContact)
      .where('uuid', customerContactUUID);

    return createSuccessResponse({
      message: 'Customer Contact updated successfully!',
    });
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    throw new InternalServerError();
  }
};

export default updateCustomerContact;
