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

const getOcrImportedPurhaseOrders = async () => {
  await initializeDb();
  try {
    const octImportedPurchaseOrders = await knexInstance(
      'ocr_imported_purchase_order_draft as pod'
    )
      .leftJoin(
        'ocr_imported_purchase_order_draft_item as podi',
        'pod.ocr_imported_purchase_order_draft_id',
        'podi.ocr_imported_purchase_order_draft_id'
      )
      .leftJoin('project', 'podi.project_id', 'project.project_id')
      .leftJoin(
        'purchase_order_item_status',
        'podi.purchase_order_item_status_id',
        'purchase_order_item_status.purchase_order_item_status_id'
      )
      .leftJoin(
        'vendor as vendor_items',
        'pod.vendor_id',
        'vendor_items.vendor_id'
      )
      .leftJoin(
        'vendor as vendor_draft',
        'pod.vendor_id',
        'vendor_draft.vendor_id'
      )
      .leftJoin(
        'user as user_created_pod',
        'pod.created_by',
        'user_created_pod.user_id'
      )
      .leftJoin(
        'user as user_created_podi',
        'podi.created_by',
        'user_created_podi.user_id'
      )
      .leftJoin(
        'credit_card',
        'pod.credit_card_id',
        'credit_card.credit_card_id'
      )
      .select([
        'pod.ocr_imported_purchase_order_draft_id',
        knexInstance.raw(
          `json_build_object('user_id', user_created_pod.user_id, 'requester', ("user_created_pod".first_name || ' ' || "user_created_pod".last_name)) as created_by`
        ),
        'pod.created_at',
        'pod.last_updated_at',
        'pod.ocr_suggested_vendor',
        'pod.ocr_suggesetd_purchase_order_number',
        'pod.s3_uri',
        knexInstance.raw(
          `json_build_object('credit_card_id', credit_card.credit_card_id, 'credit_card_name', credit_card.credit_card_name) as credit_card`
        ),
        knexInstance.raw(
          `json_build_object('vendor_id', vendor_draft.vendor_id, 'vendor_name', vendor_draft.vendor_name) as vendor`
        ),
      ])
      .select(
        knexInstance.raw(`
      json_agg(
        json_build_object(
          'ocr_imported_purchase_order_draft_item_id', podi.ocr_imported_purchase_order_draft_item_id,
          'ocr_imported_purchase_order_draft_id', podi.ocr_imported_purchase_order_draft_id,
          'created_by', json_build_object('user_id', user_created_podi.user_id, 'requester', (user_created_podi.first_name || ' ' || user_created_podi.last_name)),
          'item_name', podi.item_name,
          'price', podi.price,
          'quantity', podi.quantity,
          'unit_of_measure', podi.unit_of_measure,
          'description', podi.description,
          'created_at', podi.created_at,
          'last_updated_at', podi.last_updated_at,
          'project', json_build_object('project_id', project.project_id, 'project_name', project.project_name),
          'purchase_order_item_status', json_build_object('purchase_order_item_status_id', purchase_order_item_status.purchase_order_item_status_id, 'purchase_order_item_status_name', purchase_order_item_status.purchase_order_item_status_name),
          'vendor', json_build_object('vendor_id', vendor_items.vendor_id, 'vendor_name', vendor_items.vendor_name)
        )
      ) as ocr_imported_purchase_order_items
    `)
      )
      .groupBy(
        'pod.ocr_imported_purchase_order_draft_id',
        'user_created_pod.user_id',
        'user_created_podi.user_id',
        'credit_card.credit_card_id',
        'vendor_draft.vendor_id',
        'vendor_draft.vendor_name'
      )
      .where('pod.is_active', '=', true)
      .andWhere('podi.is_active', '=', true);

    return {
      statusCode: 200,
      body: JSON.stringify(octImportedPurchaseOrders),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error fetching OCR Imported Purchase Orders:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Server Error, ${error}`,
      }),
    };
  }
};

export default getOcrImportedPurhaseOrders;
