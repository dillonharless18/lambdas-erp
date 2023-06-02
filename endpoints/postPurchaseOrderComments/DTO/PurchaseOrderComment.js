class PurchaseOrderComment {
  constructor(item) {
    this.purchase_order_id = item.purchase_order_id;
    this.comment_text = item.comment_text;
  }
}

export default PurchaseOrderComment;
