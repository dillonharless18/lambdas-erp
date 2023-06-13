class PurchaseOrderRequestItem {
  constructor(item) {
    this.purchase_order_request_item_id = item.purchase_order_request_item_id;
    this.item_name = item.item_name;
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.description = item.description;
    this.project_id = item.project_id;
    this.vendor_id = item.vendor_id;
    this.urgent_order_status_id = item.urgent_order_status_id;
  }
}

export default PurchaseOrderRequestItem;
