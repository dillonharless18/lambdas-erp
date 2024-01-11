import initializeKnex from '/opt/nodejs/db/index.js';
import { DatabaseError, NotFoundError } from '/opt/nodejs/errors.js';
import { createSuccessResponse } from '/opt/nodejs/apiResponseUtil.js';

let knexInstance;

const initializeDb = async () => {
  if (!knexInstance) {
    try {
      knexInstance = await initializeKnex();
    } catch (error) {
      console.error('Error initializing database:', error.stack);
      throw new DatabaseError('Failed to initialize the database.');
    }
  }
};

const getAllCustomers = async (isAll) => {
  await initializeDb();
  try {
    let query = await knexInstance
      .select(
        'c.*',
        knexInstance.raw(
          '("createdBy".first_name || \' \' || "createdBy".last_name) AS CreatedBy'
        ),
        knexInstance.raw(
          '("updatedBy".first_name || \' \' || "updatedBy".last_name) AS UpdatedBy'
        ),
        knexInstance.raw('json_agg(cc.*) as customerContacts')
      )
      .from('customer as c')
      .orderBy('c.created_at', 'asc')
      .join('user as createdBy', 'createdBy.user_id', '=', 'c.created_by')
      .join('user as updatedBy', 'updatedBy.user_id', '=', 'c.last_updated_by')
      .leftJoin(
        'customer_contact as cc',
        'c.customer_id',
        '=',
        'cc.customer_id'
      )
      .groupBy(
        'c.customer_id',
        'createdBy.first_name',
        'updatedBy.first_name',
        'createdBy.last_name',
        'updatedBy.last_name'
      );

    if (!isAll) {
      query = query.where('c.is_active', true);
    }

    const customers = await query;

    return createSuccessResponse(customers);
  } catch (error) {
    console.error('Error fetching customers:', error.stack);
    throw new InternalServerError();
  }
};

export default getAllCustomers;
