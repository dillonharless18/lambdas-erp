import PurchaseOrderItemDTO from './PurchaseOrderItemDTO.js';

class PurchaseOrderDTO {
  constructor(purchaseOrder) {
    this.total_price = purchaseOrder.total_price;
    this.vendor_id = purchaseOrder.vendor_id;
    this.s3_uri = purchaseOrder.s3_uri;
    this.purchaseOrderItems = purchaseOrder.purchaseOrderItems.map(
      (item) => new PurchaseOrderItemDTO(item)
    );
  }
}

export default PurchaseOrderDTO;
