import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateInvoiceDetailRequest, InvoiceDetail } from '../models/invoice-detail.model';

@Injectable({ providedIn: 'root' })
export class InvoiceDetailService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/invoice-details`;

  getByInvoiceId(invoiceId: number): Observable<InvoiceDetail[]> {
    return this.http.get<InvoiceDetail[]>(`${this.baseUrl}/by-invoice/${invoiceId}`);
  }

  createMany(invoiceId: number, details: CreateInvoiceDetailRequest[]): Observable<InvoiceDetail[]> {
    return this.http.post<InvoiceDetail[]>(this.baseUrl, {
      invoiceId,
      details
    });
  }

  replaceMany(invoiceId: number, details: CreateInvoiceDetailRequest[]): Observable<InvoiceDetail[]> {
    return this.http.put<InvoiceDetail[]>(`${this.baseUrl}/by-invoice/${invoiceId}`, details);
  }
}
