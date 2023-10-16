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

const deleteOpenTransportationRequest = async (
  purchaseOrderTransportationRequestId
) => {
  await initializeDb();

  try {
    await knexInstance('purchase_order_transportation_request')
      .where(
        'purchase_order_transportation_request_id',
        purchaseOrderTransportationRequestId
      )
      .update({
        is_active: false,
        last_updated_at: knexInstance.raw('NOW()'),
      });

    return createSuccessResponse({
      message: 'Open Transportation Request deleted successfully!',
    });
  } catch (error) {
    console.error('Error in deleteOpenTransportationRequest:', error);
    throw new InternalServerError();
  }
};
export default deleteOpenTransportationRequest;
