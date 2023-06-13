class OcrImportedPurchaseOrderItemDTO {
  constructor(item) {
    this.ocr_imported_purchase_order_draft_item_id =
      item.ocr_imported_purchase_order_draft_item_id;
    this.price = item.price;
    this.quantity = item.quantity;
    this.unit_of_measure = item.unit_of_measure;
    this.description = item.description;
    this.project_id = item.project_id;
    this.item_name = item.item_name;
    this.suggested_vendor = item.suggested_vendor;
    this.urgent_order_status_id = item.urgent_order_status_id;
  }
}

export default PurchaseOrderItemDTO;
