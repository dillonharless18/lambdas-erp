class PurchaseOrderTransportationRequest {
  constructor(request) {
    this.purchase_order_id = request.purchase_order_id;
    this.from_location = request.from_location;
    this.to_location = request.to_location;
    this.additional_details = request.additional_details;
    this.urgent_order_status_id = request.urgent_order_status_id ? parseInt(request.urgent_order_status_id) : null;
    this.item_name = request.item_name;
    this.project_id = request.project_id ? parseInt(request.project_id) : null;
    this.recipients = request.recipients;
    this.contact_number = request.contact_number;
    this.contact_name = request.contact_name;
    this.future_transportation_date = request.future_transportation_date;
    this.transportation_time = request.transportation_time
  }
}

export default PurchaseOrderTransportationRequest;
