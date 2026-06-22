import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { ProductService } from '../../../core/services/product.service';
import { UserService } from '../../../core/services/user.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { InvoicePaymentService } from '../../../core/services/invoice-payment.service';
import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';
import { User } from '../../../core/models/user.model';
import { PaymentMethod } from '../../../core/models/invoice-payment.model';
import { CreateInvoiceRequest } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-invoices-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);
  private readonly productService = inject(ProductService);
  private readonly userService = inject(UserService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly invoicePaymentService = inject(InvoicePaymentService);

  clients: Client[] = [];
  products: Product[] = [];
  sellers: User[] = [];
  paymentMethods: PaymentMethod[] = [];

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    clientId: [0, [Validators.required, Validators.min(1)]],
    sellerId: [0, [Validators.required, Validators.min(1)]],
    date: [new Date().toISOString().slice(0, 10), [Validators.required]],
    details: this.fb.array([]),
    payments: this.fb.array([])
  });

  ngOnInit(): void {
    this.loadLookups();
    this.addDetail();
    this.addPayment();
  }

  get details(): FormArray {
    return this.form.get('details') as FormArray;
  }

  get payments(): FormArray {
    return this.form.get('payments') as FormArray;
  }

  addDetail(): void {
    this.details.push(
      this.fb.group({
        productId: [0, [Validators.required, Validators.min(1)]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        unitPrice: [0, [Validators.required, Validators.min(0.01)]],
        totalPrice: [{ value: 0, disabled: true }]
      })
    );
  }

  removeDetail(index: number): void {
    if (this.details.length <= 1) return;
    this.details.removeAt(index);
  }

  addPayment(): void {
    this.payments.push(
      this.fb.group({
        paymentMethodId: [0, [Validators.required, Validators.min(1)]],
        amount: [0, [Validators.required, Validators.min(0.01)]]
      })
    );
  }

  removePayment(index: number): void {
    if (this.payments.length <= 1) return;
    this.payments.removeAt(index);
  }

  onDetailChange(index: number): void {
    const row = this.details.at(index);
    const qty = Number(row.get('quantity')?.value || 0);
    const price = Number(row.get('unitPrice')?.value || 0);
    row.get('totalPrice')?.setValue(qty * price, { emitEvent: false });
  }

  get subtotal(): number {
    return this.details.controls.reduce((acc, row) => {
      const qty = Number(row.get('quantity')?.value || 0);
      const price = Number(row.get('unitPrice')?.value || 0);
      return acc + qty * price;
    }, 0);
  }

  get tax(): number {
    return this.subtotal * 0.12;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  get paymentsTotal(): number {
    return this.payments.controls.reduce((acc, row) => {
      const amount = Number(row.get('amount')?.value || 0);
      return acc + amount;
    }, 0);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (Math.abs(this.paymentsTotal - this.total) > 0.01) {
      this.error = 'La suma de pagos debe ser igual al total de la factura.';
      return;
    }

    this.loading = true;
    this.error = null;

    const payload: CreateInvoiceRequest = {
      clientId: Number(this.form.value.clientId),
      sellerId: Number(this.form.value.sellerId),
      date: String(this.form.value.date),
      details: this.details.controls.map(row => ({
        productId: Number(row.get('productId')?.value),
        quantity: Number(row.get('quantity')?.value),
        unitPrice: Number(row.get('unitPrice')?.value),
        totalPrice: Number(row.get('quantity')?.value) * Number(row.get('unitPrice')?.value)
      })),
      payments: this.payments.controls.map(row => ({
        paymentMethodId: Number(row.get('paymentMethodId')?.value),
        amount: Number(row.get('amount')?.value)
      }))
    };

    this.invoiceService.create(payload).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  private loadLookups(): void {
    this.clientService.getAll(1, 300, '').subscribe({
      next: r => (this.clients = r.items),
      error: () => (this.clients = [])
    });

    this.productService.getAll(1, 500, '').subscribe({
      next: r => (this.products = r.items),
      error: () => (this.products = [])
    });

    this.userService.getAll(1, 300).subscribe({
      next: r => (this.sellers = r.items.filter(x => x.role === 'Seller' || x.role === 'Admin')),
      error: () => (this.sellers = [])
    });

    this.invoicePaymentService.getPaymentMethods().subscribe({
      next: r => (this.paymentMethods = r),
      error: () => {
        this.paymentMethods = [];
        this.error = 'No se pudo cargar formas de pago. Verifica que exista la tabla PaymentMethods y que la API esté actualizada.';
      }
    });
  }
}
