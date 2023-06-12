import OcrImportedPurchaseOrderDTO from './DTO/OcrImportedPurchaseOrderDTO';
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

const postOcrImportedPurchaseOrder = async (ocrImportedPurchaseOrder) => {
  await initializeDb();

  if (typeof ocrImportedPurchaseOrder !== 'object' || ocrImportedPurchaseOrder === null) {
    console.error('Error: The ocrImportedPurchaseOrder parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: The ocrImportedPurchaseOrder parameter must be an object',
      }),
    };
  }

  const purchaseOrder = new OcrImportedPurchaseOrderDTO(
    ocrImportedPurchaseOrder
  );

  try {
    await knexInstance.transaction(async (trx) => {
      const purchase_order_id = uuidv4();
      const purchase_order_number = Math.floor(Math.random() * 1e12).toString();

      const purchaseOrderId = await trx('purchase_order')
        .insert({
          purchase_order_id,
          created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
          last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
          total_price: purchaseOrder.total_price,
          vendor_id: purchaseOrder.vendor_id,
          purchase_order_status_id: '2', // Needs Receiving
          s3_uri: purchaseOrder.s3_uri,
          created_at: knexInstance.raw('NOW()'),
          last_updated_at: knexInstance.raw('NOW()'),
          purchase_order_number: purchase_order_number,
          quickbooks_purchase_order_id: '1',
        })
        .returning('purchase_order_id');

      await trx('ocr_purchase_order_draft_by_created_purchase_order').insert({
        purchase_order_id: purchaseOrderId[0].purchase_order_id,
        ocr_imported_purchase_order_draft_id:
        purchaseOrder.ocr_imported_purchase_order_draft_id,
      });

      await trx('ocr_imported_purchase_order_draft')
        .where(
          'ocr_imported_purchase_order_draft_id',
          purchaseOrder.ocr_imported_purchase_order_draft_id
        )
        .update({
          is_active: false,
          last_updated_at: knexInstance.raw('NOW()'),
        });

      const ocrImportedPurchaseOrderItemPromises =
        purchaseOrder.purchaseOrderItems.map(async (item) => {
          const purchaseOrderItemId = await trx('purchase_order_item')
            .insert({
              purchase_order_item_id: uuidv4(),
              purchase_order_id: purchase_order_id,
              created_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
              last_updated_by: '1b3ef41c-23af-4eee-bbd7-5610b38e37f2',
              price: item.price,
              quantity: item.quantity,
              unit_of_measure: item.unit_of_measure,
              description: item.description,
              project_id: item.project_id,
              purchase_order_item_status_id: '2', // Needs Receiving
              s3_uri: purchaseOrder.s3_uri, // Passing Purchase Order s3 attachment, need to discuss it, we don't have any s3 column for ocrPOItem
              item_name: item.item_name,
              suggested_vendor: item.suggested_vendor,
              urgent_order_status_id: item.urgent_order_status_id,
              created_at: knexInstance.raw('NOW()'),
              last_updated_at: knexInstance.raw('NOW()'),
              is_active: true,
            })
            .returning('purchase_order_item_id');

          await trx(
            'ocr_imported_purchase_order_draft_item_by_purchase_order_item'
          ).insert({
            purchase_order_item_id:
              purchaseOrderItemId[0].purchase_order_item_id,
            ocr_imported_purchase_order_draft_item_id:
              item.ocr_imported_purchase_order_draft_item_id,
          });

          await trx('ocr_imported_purchase_order_draft_item')
            .where(
              'ocr_imported_purchase_order_draft_item_id',
              item.ocr_imported_purchase_order_draft_item_id
            )
            .update({
              is_active: false,
              last_updated_at: knexInstance.raw('NOW()'),
            });
        });

      await Promise.all(ocrImportedPurchaseOrderItemPromises);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'OCr Imported Purchase Order created successfully!',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error in postOcrImportedPurchaseOrder:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error.message}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export default postOcrImportedPurchaseOrder;
