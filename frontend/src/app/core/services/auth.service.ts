import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, map, of, Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const TOKEN_STORAGE_KEY = 'ses.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenState = signal<string | null>(this.readStoredToken());
  private readonly userState = signal<AuthUser | null>(null);

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenState() !== null);

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.accessToken);
          this.userState.set(response.user);
        }),
      );
  }

  logout(): Observable<{ revoked: boolean }> {
    return this.http
      .post<{ revoked: boolean }>(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.clear()));
  }

  refresh(): Observable<string> {
    return this.http
      .post<{ accessToken: string }>(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => this.setToken(response.accessToken)),
        map((response) => response.accessToken),
      );
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${API_BASE_URL}/auth/me`, { withCredentials: true });
  }

  initializeAuth(): Observable<void> {
    const token = this.readStoredToken();
    if (!token) {
      return of(void 0);
    }
    return this.me().pipe(
      tap((user) => this.userState.set(user)),
      catchError(() => {
        this.clear();
        return of(void 0);
      }),
      map(() => void 0),
    );
  }

  setToken(token: string): void {
    this.tokenState.set(token);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // Storage may be unavailable; session stays in memory only.
    }
  }

  clear(): void {
    this.tokenState.set(null);
    this.userState.set(null);
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore blocked storage.
    }
  }

  private readStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
