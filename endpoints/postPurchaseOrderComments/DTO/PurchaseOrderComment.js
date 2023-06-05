class PurchaseOrderComment {
  constructor(comment) {
    this.purchase_order_comment_id = comment.purchase_order_comment_id;
    this.purchase_order_id = comment.purchase_order_id;
    this.comment_text = comment.comment_text;
    this.created_by = comment.created_by;
    this.created_at = comment.created_at;
    this.last_updated_at = comment.last_updated_at;
    this.last_updated_by = comment.last_updated_by
  }
}

export default PurchaseOrderComment;
