export interface InvoicePayment {
  id: number;
  invoiceId: number;
  paymentMethodId: number;
  amount: number;
}

export interface CreateInvoicePaymentRequest {
  paymentMethodId: number;
  amount: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  isActive?: boolean;
}
