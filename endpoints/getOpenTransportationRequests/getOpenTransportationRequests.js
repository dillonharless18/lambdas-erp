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

const getOpenTransportationRequests = async () => {
  await initializeDb();
  try {
    const openTransportationRequests = await knexInstance(
      'purchase_order_transportation_request as potr'
    )
      .select([
        'potr.*', // fetch all columns from purchase_order_transportation_request
        'p.project_name',
        knexInstance.raw("CONCAT(u.first_name, ' ', u.last_name) as requester"),
        'po.purchase_order_number',
        'trs.transportation_request_status_name',
        'trt.transportation_request_type_name',
        'uos.urgent_order_status_name',
      ])
      .leftJoin('project as p', 'p.project_id', 'potr.project_id')
      .leftJoin('user as u', 'u.user_id', 'potr.created_by')
      .leftJoin(
        'purchase_order as po',
        'po.purchase_order_id',
        'potr.purchase_order_id'
      )
      .leftJoin(
        'transportation_request_status as trs',
        'trs.transportation_request_status_id',
        'potr.transportation_request_status_id'
      )
      .leftJoin(
        'transportation_request_type as trt',
        'trt.transportation_request_type_id',
        'potr.transportation_request_type_id'
      )
      .leftJoin(
        'urgent_order_status as uos',
        'uos.urgent_order_status_id',
        'potr.urgent_order_status_id'
      )
      .where('potr.transportation_request_status_id', 1)
      .andwhere('potr.is_active', true);

    return {
      statusCode: 200,
      body: JSON.stringify(openTransportationRequests),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching Open Transportation Requests:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Server Error, ${error}`,
      }),
    };
  }
};

export default getOpenTransportationRequests;
