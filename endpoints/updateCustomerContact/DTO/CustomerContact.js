class CustomerContact {
    constructor(data) {
      this.first_name = data.first_name;
      this.middle_initial = data.middle_initial;
      this.last_name = data.last_name;
      this.address_1 = data.address_1;
      this.address_2 = data.address_2;
      this.state = data.state;
      this.city = data.city;
      this.postal_code = data.postal_code;
      this.country = data.country;
      this.notes = data.notes;
      this.customer_id = data.customer_id;
    }
  }
  
  export default CustomerContact;
  