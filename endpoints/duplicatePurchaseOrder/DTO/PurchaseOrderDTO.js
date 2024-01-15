import PurchaseOrderItemDTO from "./PurchaseOrderItemDTO.js";

class PurchaseOrderDTO {
    constructor(purchaseOrder) {
        this.total_price = purchaseOrder.total_price;
        this.vendor_id = purchaseOrder.vendor_id;
        this.s3_uri = purchaseOrder.s3_uri;
        this.shipping_cost = purchaseOrder.shipping_cost;
        this.estimated_taxes = purchaseOrder.estimated_taxes;
        this.purchase_order_status_id = purchaseOrder.purchase_order_status_id;
        this.purchase_order_number = purchaseOrder.purchase_order_number;
        this.purchaseOrderItems = purchaseOrder.purchaseOrderItems.map(
            (item) => new PurchaseOrderItemDTO(item)
        );
    }
}

export default PurchaseOrderDTO;
