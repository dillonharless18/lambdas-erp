import initializeKnex from '/opt/nodejs/db/index.js';
import { InternalServerError, DatabaseError } from '/opt/nodejs/errors.js';
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

const deleteCustomerContact = async (customerContactUUID, userSub) => {
  await initializeDb();

  try {
    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    await knexInstance('customer_contact')
      .update({
        deleted_at: knexInstance.raw('NOW()'),
        last_updated_by: user[0],
      })
      .where('uuid', customerContactUUID);

    return createSuccessResponse({
      message: 'Customer Contact deleted successfully!',
    });
  } catch (error) {
    console.error('Error in deleteCustomerContact:', error);
    throw new InternalServerError();
  }
};
export default deleteCustomerContact;
