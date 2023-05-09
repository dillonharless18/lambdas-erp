// DTO/PurchaseOrderItem.js
class PurchaseOrderItem {
    constructor(item) {
      this.purchase_order_request_id = item.purchase_order_request_id;
      this.quantity = item.quantity;
      this.item_name = item.item_name;
      this.unit_of_measurement = item.unit_of_measurement;
      this.suggested_vendor = item.suggested_vendor;
      this.urgent_order_status = item.urgent_order_status;
      this.project_id = item.project_id;
      this.description = item.description;
      this.s3_uri = item.s3_uri;
      this.user_id = item.user_id;
      this.created_at = item.created_at;
      this.purchase_order_request_item_status_id = item.purchase_order_request_item_status_id;
    }
  }
  
  module.exports = PurchaseOrderItem;
  