class PurchaseOrder {
  constructor(item) {
    this.purchase_order_id = item.purchase_order_id;
    this.purchase_order_number = item.purchase_order_number;
    this.total_price = item.total_price;
    this.quickbooks_purchase_order_id = item.quantity;
    this.s3_uri = item.s3_uri;
    this.vendor_id = item.vendor_id;
    this.purchase_order_status_id = item.purchase_order_status_id;
    this.last_updated_at = item.last_updated_at;
    this.last_updated_by = item.last_updated_by;
  }
}

export default PurchaseOrder;
