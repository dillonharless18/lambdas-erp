class PurchaseOrderRequestItemComment {
  constructor(item) {
    this.purchase_order_request_item_id = item.purchase_order_request_item_id;
    this.comment_text = item.comment_text;
  }
}

export default PurchaseOrderRequestItemComment;
