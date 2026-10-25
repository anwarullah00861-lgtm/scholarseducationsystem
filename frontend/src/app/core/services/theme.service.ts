import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'ses.theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
const LIGHT_THEME_COLOR = '#0e4a3e';
const DARK_THEME_COLOR = '#081310';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly view = this.document.defaultView;
  private readonly mediaQuery = this.view?.matchMedia?.(DARK_QUERY) ?? null;

  private readonly systemDark = signal(this.mediaQuery?.matches ?? false);
  private readonly preferenceState = signal<ThemePreference>(this.readPreference());

  readonly preference = this.preferenceState.asReadonly();
  readonly resolved = computed<ResolvedTheme>(() => {
    const preference = this.preferenceState();
    if (preference === 'system') {
      return this.systemDark() ? 'dark' : 'light';
    }
    return preference;
  });

  constructor() {
    this.applyTheme(this.resolved());
    this.mediaQuery?.addEventListener('change', this.handleSystemChange);
  }

  setPreference(preference: ThemePreference): void {
    this.preferenceState.set(preference);
    this.persistPreference(preference);
    this.applyTheme(this.resolved());
  }

  private readonly handleSystemChange = (event: MediaQueryListEvent): void => {
    this.systemDark.set(event.matches);
    if (this.preferenceState() === 'system') {
      this.applyTheme(this.resolved());
    }
  };

  private applyTheme(theme: ResolvedTheme): void {
    const root = this.document.documentElement;
    root.dataset['theme'] = theme;
    root.style.colorScheme = theme;

    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  }

  private readPreference(): ThemePreference {
    try {
      const stored = this.view?.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Local storage can be unavailable in private browsing or embedded views.
    }
    return 'system';
  }

  private persistPreference(preference: ThemePreference): void {
    try {
      this.view?.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // A blocked storage API must not break theme switching for the session.
    }
  }
}
