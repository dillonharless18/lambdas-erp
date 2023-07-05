class TransportationTrip {
  constructor(trip) {
    this.driver_id = trip.driver_id;
    this.vehicle_type_id = trip.vehicle_type_id;
    this.additional_details = trip.additional_details;
    this.transportation_trip_status_id = trip.transportation_trip_status_id;
  }
}

export default TransportationTrip;
