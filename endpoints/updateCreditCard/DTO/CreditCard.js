class CreditCard {
  constructor(data) {
    this.credit_card_name = data.credit_card_name;
    this.is_active = data.is_active;
    this.credit_card_last_four_digits = data.credit_card_last_four_digits;
  }
}

export default CreditCard;
