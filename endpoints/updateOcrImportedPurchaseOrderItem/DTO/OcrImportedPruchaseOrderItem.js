class OcrImportedPurchaseOrderItem {
  constructor(OCRPOItem) {
    this.item_name = OCRPOItem.item_name;
    this.price = OCRPOItem.price;
    this.quantity = OCRPOItem.quantity;
    this.unit_of_measure = OCRPOItem.unit_of_measure;
    this.description = OCRPOItem.description;
    this.project_id = OCRPOItem.project_id;
  }
}

export default OcrImportedPurchaseOrderItem;
