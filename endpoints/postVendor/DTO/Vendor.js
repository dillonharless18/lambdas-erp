class Vendor {
  constructor(data) {
    this.vendor_name = data.vendor_name;
    this.is_active = data.is_active;
    this.is_net_vendor = data.is_net_vendor;
    this.billing_contact = data.billing_contact;
    this.billing_contact_number = data.billing_contact_number;
    this.account_payable_contact = data.account_payable_contact;
    this.account_payable_contact_number = data.account_payable_contact_number;
    this.tax_ID = data.tax_ID;
    this.billed_from_address1 = data.billed_from_address1;
    this.billed_from_address2 = data.billed_from_address2;
    this.billed_from_city = data.billed_from_city;
    this.billed_from_state = data.billed_from_state;
    this.billed_from_postal_code = data.billed_from_postal_code;
    this.billed_from_country = data.billed_from_country;
    this.payment_terms = data.payment_terms;
    this.shipped_from_address1 = data.shipped_from_address1;
    this.shipped_from_address2 = data.shipped_from_address2;
    this.shipped_from_city = data.shipped_from_city;
    this.shipped_from_state = data.shipped_from_state;
    this.shipped_from_postal_code = data.shipped_from_postal_code;
    this.shipped_from_country = data.shipped_from_country;
    this.email = data.email;
    this.phone_number = data.phone_number;
  }
}

export default Vendor;
