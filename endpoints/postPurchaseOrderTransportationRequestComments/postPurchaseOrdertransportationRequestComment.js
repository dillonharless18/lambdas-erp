import PurchaseOrderTransportationRequestComment from './DTO/PurchaseOrderTransportationRequestComment.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { v4 as uuidv4 } from 'uuid';

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const postPurchaseOrderTransportationRequestComment = async (
  comment,
  purchaseOrderTransportationRequestId
) => {
  await initializeDb();

  if (
    !comment ||
    typeof comment !== 'object' ||
    Object.keys(comment).length === 0
  ) {
    throw new Error('The comment parameter must not be empty');
  }

  const purchaseOrderTransportationRequestComment =
    new PurchaseOrderRequestItemComment(comment);

  const dataToInsert = {
    purchase_order_transportation_request_comment_id: uuidv4(),
    purchase_order_transportation_request_id:
      purchaseOrderTransportationRequestId,
    comment_text: purchaseOrderTransportationRequestComment.comment_text,
    created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    created_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('purchase_order_transportation_request_comment').insert(
      dataToInsert
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message:
          'Purchase Order Transportation Request Comment added successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error(
      'Error in postPurchaseOrderTransportationRequestComment:',
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postPurchaseOrderTransportationRequestComment;
