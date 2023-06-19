class OcrImportedPurchaseOrder {
  constructor(purchaseOrder) {
    this.vendor_id = purchaseOrder.vendor_id;
    this.ocr_suggested_purchase_order_number =
      purchaseOrder.ocr_suggested_purchase_order_number;
    this.credit_card_id = purchaseOrder.credit_card_id;
  }
}

export default OcrImportedPurchaseOrder;
