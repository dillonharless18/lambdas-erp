class PurchaseOrderItemDTO {
    constructor(item) {
        this.purchase_order_request_item_id =
            item.purchase_order_request_item_id;
        this.price = item.price;
        this.quantity = item.quantity;
        this.unit_of_measure = item.unit_of_measure;
        this.description = item.description;
        this.project_id = item.project_id;
        this.s3_uri = item.s3_uri;
        this.item_name = item.item_name;
        this.suggested_vendor = item.suggested_vendor;
        this.urgent_order_status_id = item.urgent_order_status_id;
        this.purchase_order_item_status_id = item.purchase_order_item_status_id;
    }
}

export default PurchaseOrderItemDTO;
