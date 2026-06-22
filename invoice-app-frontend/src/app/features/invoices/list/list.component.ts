import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice, InvoiceFilters } from '../../../core/models/invoice.model';
import { PagedResult } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private readonly invoiceService = inject(InvoiceService);

  invoices: Invoice[] = [];
  totalCount = 0;
  currentPage = 1;
  readonly pageSize = 10;
  loading = false;
  error: string | null = null;

  filters: InvoiceFilters = {
    invoiceNumber: '',
    status: undefined,
    dateFrom: '',
    dateTo: ''
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    const params: InvoiceFilters = {
      page: this.currentPage,
      pageSize: this.pageSize,
      invoiceNumber: this.filters.invoiceNumber || undefined,
      status: this.filters.status || undefined,
      dateFrom: this.filters.dateFrom || undefined,
      dateTo: this.filters.dateTo || undefined
    };

    this.invoiceService.getAll(params).subscribe({
      next: (result: PagedResult<Invoice>) => {
        this.invoices = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.load();
  }

  cancel(id: number): void {
    if (!confirm('Cancelar esta factura?')) return;
    this.invoiceService.cancel(id).subscribe({
      next: () => this.load(),
      error: (err: Error) => (this.error = err.message)
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.load();
  }
}
