import PurchaseOrderTransportationRequest from './DTO/PurchaseOrderTransportationRequest.js';
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

const postPurchaseOrderTransportationRequest = async (body) => {
  await initializeDb();

  if (!body) {
    throw new Error('No data provided');
  }

  const transportationRequestData = new PurchaseOrderTransportationRequest(
    body
  );

  const dataToInsert = {
    purchase_order_transportation_request_id: uuidv4(),
    purchase_order_id: transportationRequestData.purchase_order_id,
    transportation_request_type_id: 1, // means its purchase order transportation request (PO)
    from_location: transportationRequestData.from_location,
    to_location: transportationRequestData.to_location,
    additional_details: transportationRequestData.additional_details,
    urgent_order_status_id: transportationRequestData.urgent_order_status_id,
    transportation_request_status_id: 1, // means status is Open
    created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    created_at: knexInstance.raw('NOW()'),
    last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    last_updated_at: knexInstance.raw('NOW()'),
  };

  try {
    await knexInstance('purchase_order_transportation_request').insert(
      dataToInsert
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Purchase Order Transportation Request added successfully!',
        data: dataToInsert
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postPurchaseOrderTransportationRequest:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postPurchaseOrderTransportationRequest;
