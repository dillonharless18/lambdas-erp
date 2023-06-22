class TransportationTrip {
  constructor(trip) {
    this.driver_id = trip.driver_id;
    this.trip_name = trip.trip_name;
    this.vehicle_type_id = trip.vehicle_type_id;
    this.purchase_order_transportation_request_ids = trip.purchase_order_transportation_request_id
  }
}

export default TransportationTrip;
