class PurchaseOrderTransportationRequest {
  constructor(request) {
    this.purchase_order_id = request.purchase_order_id;
    this.from_location = request.from_location;
    this.to_location = request.to_location;
    this.additional_details = request.additional_details;
    this.urgent_order_status_id = request.urgent_order_status_id;
    this.transportation_request_type_id = request.transportation_request_type_id
    this.transportation_request_status_id = request.transportation_request_status_id
  }
}

export default PurchaseOrderTransportationRequest;
