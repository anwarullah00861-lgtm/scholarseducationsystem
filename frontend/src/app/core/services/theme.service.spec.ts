import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

interface MediaQueryHarness {
  matches: boolean;
  listener: ((event: MediaQueryListEvent) => void) | null;
}

function installMatchMedia(matches: boolean): MediaQueryHarness {
  const harness: MediaQueryHarness = { matches, listener: null };

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: harness.matches,
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          harness.listener = listener;
        },
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });

  return harness;
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to the system preference and resolves the dark scheme', () => {
    installMatchMedia(true);
    const service = TestBed.inject(ThemeService);

    expect(service.preference()).toBe('system');
    expect(service.resolved()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('persists an explicit selection and applies it immediately', () => {
    installMatchMedia(false);
    const service = TestBed.inject(ThemeService);

    service.setPreference('dark');

    expect(service.preference()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(localStorage.getItem('ses.theme')).toBe('dark');
  });

  it('restores a stored preference', () => {
    localStorage.setItem('ses.theme', 'light');
    installMatchMedia(true);

    const service = TestBed.inject(ThemeService);

    expect(service.preference()).toBe('light');
    expect(service.resolved()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('tracks operating system changes while in system mode', () => {
    const media = installMatchMedia(false);
    const service = TestBed.inject(ThemeService);

    expect(service.resolved()).toBe('light');

    media.matches = true;
    media.listener?.({ matches: true } as MediaQueryListEvent);

    expect(service.resolved()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
