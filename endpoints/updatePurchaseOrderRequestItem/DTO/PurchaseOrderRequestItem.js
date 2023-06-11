class PurchaseOrderRequestItem {
  constructor(item) {
    this.purchase_order_request_item_id = item.purchase_order_request_item_id;
    this.item_name = item.item_name;
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.description = item.description;
  }
}

export default PurchaseOrderRequestItem;
