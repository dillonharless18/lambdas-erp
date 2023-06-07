class PurchaseOrderTransportationRequest {
  constructor(item) {
    this.purchase_order_id = item.purchase_order_id;
    this.from_location = item.from_location;
    this.to_location = item.to_location;
    this.additional_details = item.additional_details;
    this.urgent_order_status_id = item.urgent_order_status_id;
    this.created_by = item.created_by;
    this.last_updated_by = item.created_by;
  }
}

export default PurchaseOrderTransportationRequest;
