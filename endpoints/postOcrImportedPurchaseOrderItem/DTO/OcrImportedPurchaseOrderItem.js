class OcrImportedPurchaseOrderItem {
  constructor(item) {
    this.ocr_imported_purchase_order_draft_id = item.ocr_imported_purchase_order_draft_id;
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.description = item.description;
    this.project_id = item.project_id;
    this.item_name = item.item_name;
    this.price = item.price;
  }
}

export default OcrImportedPurchaseOrderItem;
