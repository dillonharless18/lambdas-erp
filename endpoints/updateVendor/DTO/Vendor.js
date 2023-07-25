class Vendor {
  constructor(data) {
    this.vendor_id = data.vendor_id;
    this.vendor_name = data.vendor_name;
    this.is_active = data.is_active;
    this.is_net_vendor = data.is_net_vendor;
    this.billing_contact = data.billing_contact;
    this.billing_contact_number = data.billing_contact_number;
    this.account_payable_contact = data.account_payable_contact;
    this.account_payable_contact_number = data.account_payable_contact_number;
    this.tax_ID = data.tax_ID;
    this.billed_from = data.billed_from;
    this.shipped_from = data.shipped_from;
    this.payment_terms = data.payment_terms;
    this.email = data.email;
    this.phone_number = data.phone_number;
  }
}

export default Vendor;
