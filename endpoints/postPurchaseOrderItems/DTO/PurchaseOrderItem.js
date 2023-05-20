class PurchaseOrderItem {
  constructor(item) {
    this.purchase_order_id = item.purchase_order_id;
    this.price = item.price;
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.description = item.description;
    this.is_damaged = item.is_damaged;
    this.damage_or_return_text = item.damage_or_return_text;
    this.project_id = item.project_id;
    this.purchase_order_item_status_id = item.purchase_order_item_status_id;
  }
}

export default PurchaseOrderItem;
