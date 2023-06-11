class OcrImportedPurchaseOrderComment {
  constructor(item) {
    this.ocr_imported_purchase_order_draft_id =
      item.ocr_imported_purchase_order_draft_id;
    this.comment_text = item.comment_text;
  }
}

export default OcrImportedPurchaseOrderComment;
