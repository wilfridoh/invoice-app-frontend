import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { PagedResult } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  clients: Client[] = [];
  totalCount = 0;
  currentPage = 1;
  readonly pageSize = 10;
  loading = false;
  error: string | null = null;
  search = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.clientService.getAll(this.currentPage, this.pageSize, this.search).subscribe({
      next: (result: PagedResult<Client>) => {
        this.clients = result.items;
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

  delete(id: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;

    this.clientService.delete(id).subscribe({
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
