import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly TOKEN_KEY = 'invoice_token';
  private readonly USER_KEY = 'invoice_user';

  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  get isAuthenticated$(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.store(this.TOKEN_KEY, response.token);
          this.store(this.USER_KEY, JSON.stringify({ username: response.username, role: response.role }));
          this.isLoggedIn$.next(true);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.TOKEN_KEY)
      : null;
  }

  getUser(): { username: string; role: string } | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isAdmin(): boolean {
    return this.getUser()?.role === 'Admin';
  }

  private hasToken(): boolean {
    return isPlatformBrowser(this.platformId)
      ? !!localStorage.getItem(this.TOKEN_KEY)
      : false;
  }

  private store(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }
}
