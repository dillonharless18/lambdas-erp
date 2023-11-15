import Project from './DTO/Project.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import {
  BadRequestError,
  InternalServerError,
  DatabaseError,
  ConflictError,
} from '/opt/nodejs/errors.js';
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

const updatedProject = async (projectId, body, userSub) => {
  await initializeDb();

  if (typeof body !== 'object' || body === null) {
    console.error('Error: The project parameter must be an object');
    throw new BadRequestError(
      'Invalid input format: The project parameter must be an object'
    );
  }

  try {
    const user = await knexInstance('user')
      .where('cognito_sub', userSub)
      .pluck('user_id');

    const project = new Project(body);

    let updatedProject = {
      last_updated_by: user[0],
      last_updated_at: knexInstance.raw('NOW()'),
      ...project,
    };

    updatedProject = Object.fromEntries(
      Object.entries(updatedProject).filter(
        ([_, val]) => val !== null && val !== undefined && val !== ''
      )
    ); // remove null or empty values

    if (updatedProject.is_active === false) {
      const [purchaseOrderItemsCount] = await knexInstance(
        'purchase_order_request_item  as pori'
      )
        .count('pori.purchase_order_request_item_id')
        .join('vendor as v', 'v.vendor_id', '=', 'pori.vendor_id')
        .where('pori.project_id', projectId)
        .andWhere('pori.is_active', true)
        .andWhere('v.is_net_vendor', true);

      const [ocrImportedPurchaseOrderDraftItemsCount] = await knexInstance(
        'ocr_imported_purchase_order_draft_item as oipodi'
      )
        .count('oipodi.ocr_imported_purchase_order_draft_item_id')
        .join(
          'ocr_imported_purchase_order_draft as oipod',
          'oipod.ocr_imported_purchase_order_draft_id',
          '=',
          'oipodi.ocr_imported_purchase_order_draft_id'
        )
        .join('vendor as v', 'v.vendor_id', '=', 'oipod.vendor_id')
        .where('oipodi.project_id', projectId)
        .andWhere('v.is_net_vendor', true)
        .andWhere('oipodi.is_active', true);

      const [nonReceivedPurchaseOrderItemsCount] = await knexInstance(
        'purchase_order_item as poi'
      )
        .count('poi.purchase_order_item_id')
        .join(
          'purchase_order as po',
          'po.purchase_order_id',
          '=',
          'poi.purchase_order_id'
        )
        .join('vendor as v', 'v.vendor_id', '=', 'po.vendor_id')
        .where('poi.project_id', projectId)
        .andWhere('poi.is_active', true)
        .andWhere('v.is_net_vendor', true)
        .andWhere('po.purchase_order_status_id', '!=', 4); // not equal received

      if (
        purchaseOrderItemsCount.count > 0 ||
        ocrImportedPurchaseOrderDraftItemsCount.count > 0 ||
        nonReceivedPurchaseOrderItemsCount.count > 0
      ) {
        throw new ConflictError('Cannot Inactive Job: This job has open items');
      }
    }

    await knexInstance('project')
      .update(updatedProject)
      .where('project_id', projectId);

    return createSuccessResponse({ message: 'Project updated successfully!' });
  } catch (error) {
    console.error('Error in updateProject:', error);
    throw new InternalServerError();
  }
};

export default updatedProject;
