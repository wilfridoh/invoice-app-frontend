export type InvoiceStatus = 'Issued' | 'Cancelled';

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  sellerId: number;
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
}

export interface CreateInvoiceDetailItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateInvoicePaymentItem {
  paymentMethodId: number;
  amount: number;
}

export interface CreateInvoiceRequest {
  clientId: number;
  sellerId: number;
  date: string;
  details: CreateInvoiceDetailItem[];
  payments: CreateInvoicePaymentItem[];
}

export interface InvoiceFilters {
  page?: number;
  pageSize?: number;
  invoiceNumber?: string;
  clientId?: number;
  sellerId?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: InvoiceStatus;
}
