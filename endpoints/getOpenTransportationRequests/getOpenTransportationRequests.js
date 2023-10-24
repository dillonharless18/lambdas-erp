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
        knexInstance.raw(
          'COALESCE(comments.comment_count::INTEGER, 0) as comment_count'
        ),
      ])
      .leftJoin(
        knexInstance('purchase_order_transportation_request_comment')
          .select('purchase_order_transportation_request_id')
          .count('* as comment_count')
          .groupBy('purchase_order_transportation_request_id')
          .as('comments'),
        'comments.purchase_order_transportation_request_id',
        '=',
        'potr.purchase_order_transportation_request_id'
      )
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
      .andWhere('potr.is_active', true)
      .orderBy('potr.future_transportation_date', 'asc');

    return createSuccessResponse(openTransportationRequests);
  } catch (error) {
    console.error('Error fetching Open Transportation Requests:', error);
    throw new InternalServerError();
  }
};

export default getOpenTransportationRequests;
