class ItemRequest {
  constructor(item) {
    this.item_name = item.item_name;
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.price = item.price;
    this.urgent_order_status_id = item.urgent_order_status_id;
    this.in_hand_date = item.in_hand_date ? new Date(item.in_hand_date) : null;
    this.vendor = item.vendor;
    this.project_id = item.project_id;
    this.s3_uri = item.s3_uri;
    this.suggested_vendor = item.suggested_vendor;
    this.description = item.description;
  }
}

export default ItemRequest;
