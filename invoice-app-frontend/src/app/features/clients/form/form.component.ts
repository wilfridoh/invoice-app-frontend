import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { CreateClientRequest, UpdateClientRequest } from '../../../core/models/client.model';

@Component({
  selector: 'app-clients-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);

  readonly docTypes = ['RUC', 'CI', 'Pasaporte'] as const;
  clientId: number | null = null;
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    documentType: ['RUC', [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(20)]],
    address: ['', [Validators.maxLength(300)]]
  });

  get isEditMode(): boolean {
    return this.clientId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.clientId = idParam ? Number(idParam) : null;

    if (this.isEditMode) {
      this.loadClient(this.clientId!);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const payload = this.form.getRawValue() as CreateClientRequest;

    if (this.isEditMode) {
      this.clientService.update(this.clientId!, payload as UpdateClientRequest).subscribe({
        next: () => this.router.navigate(['/clients']),
        error: (err: Error) => {
          this.error = err.message;
          this.loading = false;
        }
      });
      return;
    }

    this.clientService.create(payload).subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  private loadClient(id: number): void {
    this.loading = true;
    this.clientService.getById(id).subscribe({
      next: client => {
        this.form.patchValue({
          name: client.name,
          documentType: client.documentType,
          documentNumber: client.documentNumber,
          email: client.email,
          phone: client.phone,
          address: client.address
        });
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}
