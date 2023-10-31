import OcrImportedPurchaseOrderItemDTO from './OcrImportedPurchaseOrderItemDTO.js';

class OcrImportedPurchaseOrderDTO {
  constructor(purchaseOrder) {
    this.ocr_imported_purchase_order_draft_id =
      purchaseOrder.ocr_imported_purchase_order_draft_id;
    this.total_price = purchaseOrder.total_price;
    this.vendor_id = purchaseOrder.vendor_id;
    this.s3_uri = purchaseOrder.s3_uri;
    this.shipping_cost = purchaseOrder.shipping_cost;
    this.estimated_taxes = purchaseOrder.estimated_taxes;
    this.purchaseOrderItems =
      purchaseOrder.ocr_imported_purchase_order_items.map(
        (item) => new OcrImportedPurchaseOrderItemDTO(item)
      );
  }
}

export default OcrImportedPurchaseOrderDTO;
