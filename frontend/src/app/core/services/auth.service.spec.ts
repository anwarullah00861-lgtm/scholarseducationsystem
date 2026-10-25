import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.removeItem('ses.token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('ses.token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login, store the token and expose authentication state', () => {
    service.login({ email: 'admin@example.com', password: 'secret123' }).subscribe((result) => {
      expect(result.accessToken).toBe('test-access-token');
      expect(service.isAuthenticated()).toBe(true);
      expect(localStorage.getItem('ses.token')).toBe('test-access-token');
    });

    const req = httpMock.expectOne((request) => request.url.endsWith('/auth/login'));
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ accessToken: 'test-access-token', user: { id: '1', email: 'admin@example.com' } });
  });

  it('should clear authentication state on logout', () => {
    service.setToken('old-token');
    expect(service.isAuthenticated()).toBe(true);

    service.logout().subscribe();

    const req = httpMock.expectOne((request) => request.url.endsWith('/auth/logout'));
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ revoked: true });
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('ses.token')).toBeNull();
  });

  it('should expose authentication state from a stored token', () => {
    localStorage.setItem('ses.token', 'stored-token');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fresh = TestBed.inject(AuthService);
    expect(fresh.isAuthenticated()).toBe(true);
    expect(fresh.token()).toBe('stored-token');
  });
});
