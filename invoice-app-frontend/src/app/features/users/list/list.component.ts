import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { PagedResult } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private readonly userService = inject(UserService);

  users: User[] = [];
  totalCount = 0;
  currentPage = 1;
  readonly pageSize = 10;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.userService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (result: PagedResult<User>) => {
        this.users = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.userService.delete(id).subscribe({
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
