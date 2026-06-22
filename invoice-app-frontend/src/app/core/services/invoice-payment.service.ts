import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateInvoicePaymentRequest, InvoicePayment, PaymentMethod } from '../models/invoice-payment.model';

@Injectable({ providedIn: 'root' })
export class InvoicePaymentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/invoice-payments`;
  private readonly paymentMethodsUrl = `${environment.apiUrl}/PaymentMethods`;

  getByInvoiceId(invoiceId: number): Observable<InvoicePayment[]> {
    return this.http.get<InvoicePayment[]>(`${this.baseUrl}/by-invoice/${invoiceId}`);
  }

  createMany(invoiceId: number, payments: CreateInvoicePaymentRequest[]): Observable<InvoicePayment[]> {
    return this.http.post<InvoicePayment[]>(this.baseUrl, {
      invoiceId,
      payments
    });
  }

  replaceMany(invoiceId: number, payments: CreateInvoicePaymentRequest[]): Observable<InvoicePayment[]> {
    return this.http.put<InvoicePayment[]>(`${this.baseUrl}/by-invoice/${invoiceId}`, payments);
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.paymentMethodsUrl);
  }
}
