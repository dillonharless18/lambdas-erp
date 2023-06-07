class PurchaseOrderItem {
  constructor(item) {
    this.purchase_order_item_id = item.purchase_order_item_id;
    this.purchase_order_id = item.purchase_order_id;
    this.item_name = item.item_name;
    this.damage_or_return_text = item.damage_or_return_text;
    this.price = item.price;
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.suggested_vendor = item.suggested_vendor;
    this.s3_uri = item.s3_uri;
    this.description = item.description;
    this.project_id = item.project_id;
    this.is_damaged = item.is_damaged;
    this.urgent_order_status_id = item.urgent_order_status_id;
    this.purchase_order_item_status_id = item.purchase_order_item_status_id;
    this.is_active = item.is_active;
    this.last_updated_at = item.last_updated_at;
    this.last_updated_by = item.last_updated_by;
  }
}

export default PurchaseOrderItem;
