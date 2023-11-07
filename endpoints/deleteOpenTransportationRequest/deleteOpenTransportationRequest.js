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
    await knexInstance.transaction(async (trx) => {
      const potr = await trx('purchase_order_transportation_request')
        .where(
          'purchase_order_transportation_request_id',
          purchaseOrderTransportationRequestId
        )
        .update({
          is_active: false,
          last_updated_at: knexInstance.raw('NOW()'),
        }).returning('purchase_order_id')
      // 2 is the id for status = Needs Receiving
      const purchase_order_id = potr[0].purchase_order_id
      if (purchase_order_id) {
        await trx('purchase_order')
          .where('purchase_order_id', potr[0].purchase_order_id)
          .update({
            purchase_order_status_id: 2
          })
        await trx('purchase_order_item')
          .where('purchase_order_id', potr[0].purchase_order_id)
          .update({
            purchase_order_item_status_id: 2
          })
      }
    })

    return createSuccessResponse({
      message: 'Open Transportation Request deleted successfully!',
    });
  } catch (error) {
    console.error('Error in deleteOpenTransportationRequest:', error);
    throw new InternalServerError();
  }
};
export default deleteOpenTransportationRequest;
