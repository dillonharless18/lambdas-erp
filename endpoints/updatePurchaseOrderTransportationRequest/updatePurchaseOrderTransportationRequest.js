import PurchaseOrderTransportationRequest from './DTO/PurchaseOrderTransportationRequest.js';
import initializeKnex from '/opt/nodejs/db/index.js';

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

const postPurchaseOrderTransportationRequest = async (body, purchaseOrderTransportationRequestId) => {
  await initializeDb();

  if (!body) {
    throw new Error('No data provided');
  }

  const transportationRequestData = new PurchaseOrderTransportationRequest(
    body
  );

  let dataToUpdate = {
    purchase_order_id: transportationRequestData.purchase_order_id,
    transportation_request_type_id: transportationRequestData.transportation_request_type_id ? parseInt(transportationRequestData.transportation_request_type_id) : null,
    from_location: transportationRequestData.from_location,
    to_location: transportationRequestData.to_location,
    additional_details: transportationRequestData.additional_details,
    urgent_order_status_id: transportationRequestData.urgent_order_status_id ? parseInt(transportationRequestData.urgent_order_status_id) : null,
    transportation_request_status_id: transportationRequestData.transportation_request_status_id ? parseInt(transportationRequestData.transportation_request_status_id) : null,
    last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
    last_updated_at: knexInstance.raw('NOW()'),
  };

  dataToUpdate = Object.fromEntries(
    Object.entries(dataToUpdate).filter(([_, val]) => val !== null && val !== undefined && val !== "")
  );

  try {
    await knexInstance('purchase_order_transportation_request')
      .where('purchase_order_transportation_request_id', purchaseOrderTransportationRequestId)
      .update(dataToUpdate);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Purchase Order Transportation Request updated successfully!'
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in updatePurchaseOrderTransportationRequest:', error);
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
