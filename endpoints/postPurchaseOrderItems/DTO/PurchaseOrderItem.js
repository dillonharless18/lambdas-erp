class PurchaseOrderItem {
  constructor(item) {
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.description = item.description;
    this.project_id = item.project_id;
    this.s3_uri = item.s3_uri;
    this.item_name = item.item_name;
    this.suggested_vendor = item.suggested_vendor;
    this.urgent_order_status_id = item.urgent_order_status_id;
  }
}

export default PurchaseOrderItem;
