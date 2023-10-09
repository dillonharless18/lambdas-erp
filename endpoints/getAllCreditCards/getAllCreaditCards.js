import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError } from '/opt/nodejs/errors.js';
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

const getAllCreditCards = async () => {
  await initializeDb();
  try {
    const creditCards = await knexInstance
      .select(
        'cc.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        )
      )
      .from('credit_card as cc')
      .join('user as createdBy', 'createdBy.user_id', '=', 'cc.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'cc.last_updated_by')
      .where('cc.is_active', true)
      .orderBy('cc.created_at', 'asc');
    return createSuccessResponse(creditCards);
  } catch (error) {
    console.error('Error fetching credit cards:', error.stack);
    throw error;
  }
};

export default getAllCreditCards;
