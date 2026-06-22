export interface InvoiceDetail {
  id: number;
  invoiceId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateInvoiceDetailRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
