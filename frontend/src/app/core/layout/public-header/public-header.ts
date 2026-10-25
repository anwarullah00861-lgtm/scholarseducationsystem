import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PRIMARY_NAV, SITE } from '../../../core/config/site.config';
import { AppIcon } from '../../../shared/components/app-icon/app-icon';
import { Logo } from '../../../shared/components/logo/logo';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { MobileNavDialog } from '../../../shared/components/mobile-nav-dialog/mobile-nav-dialog';

@Component({
  selector: 'app-public-header',
  imports: [RouterLink, RouterLinkActive, AppIcon, Logo, ThemeToggle],
  template: `
    <header class="site-header" [class.site-header--scrolled]="scrolled()">
      <div class="topbar">
        <div class="container topbar__inner">
          <div class="topbar__location">
            <app-icon name="map-pin" [size]="14" />
            <span>{{ site.location }}</span>
          </div>
          <div class="topbar__actions">
            <span class="topbar__levels">PG – Class 8</span>
            <span class="topbar__divider" aria-hidden="true"></span>
            <app-theme-toggle [compact]="true" />
            <span class="topbar__divider" aria-hidden="true"></span>
            <a class="topbar__admin" routerLink="/admin">Admin</a>
          </div>
        </div>
      </div>

      <div class="header-main">
        <div class="container header-main__inner">
          <app-logo />

          <nav class="desktop-nav" aria-label="Main navigation">
            @for (item of nav; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="is-active"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                ariaCurrentWhenActive="page"
              >
                {{ item.label }}
              </a>
            }
          </nav>

          <div class="header-actions">
            <a class="btn btn--primary btn--sm header-cta" routerLink="/admissions">
              Admission information
              <app-icon name="arrow-right" [size]="15" />
            </a>
            <button
              type="button"
              class="icon-btn menu-button"
              aria-label="Open navigation"
              (click)="openNavigation()"
            >
              <app-icon name="menu" [size]="22" />
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: `
    .site-header {
      position: sticky;
      z-index: 100;
      top: 0;
      border-bottom: 1px solid var(--ses-border);
      background: color-mix(in srgb, var(--ses-surface) 92%, transparent);
      backdrop-filter: blur(16px);
      transition:
        box-shadow var(--ses-duration) ease,
        background-color var(--ses-duration) ease;
    }

    .site-header--scrolled {
      box-shadow: 0 10px 30px rgba(16, 42, 35, 0.08);
    }

    .topbar {
      border-bottom: 1px solid var(--ses-border);
      background: var(--ses-surface-2);
      color: var(--ses-muted);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .topbar__inner {
      display: flex;
      min-height: var(--ses-topbar-height);
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .topbar__location,
    .topbar__actions {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: 0.65rem;
    }

    .topbar__location span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .topbar__location app-icon {
      color: var(--ses-primary);
    }

    .topbar__levels {
      color: var(--ses-primary);
      font-weight: 750;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .topbar__divider {
      width: 1px;
      height: 0.9rem;
      background: var(--ses-border-strong);
    }

    .topbar app-theme-toggle {
      --icon-button-size: 1.65rem;
      margin: -0.3rem 0;
    }

    .topbar app-theme-toggle .icon-btn {
      width: 1.8rem;
      height: 1.8rem;
      border: 0;
      background: transparent;
    }

    .topbar__admin {
      color: var(--ses-muted);
      font-weight: 700;
      text-decoration: none;
    }

    .topbar__admin:hover {
      color: var(--ses-primary);
    }

    .header-main__inner {
      display: flex;
      min-height: var(--ses-header-height);
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .desktop-nav {
      display: none;
      align-items: center;
      gap: 0.1rem;
    }

    .desktop-nav a {
      position: relative;
      padding: 0.5rem 0.62rem;
      border-radius: var(--ses-radius-sm);
      color: var(--ses-muted);
      font-size: 0.79rem;
      font-weight: 680;
      text-decoration: none;
      white-space: nowrap;
      transition:
        color var(--ses-duration) ease,
        background-color var(--ses-duration) ease;
    }

    .desktop-nav a::after {
      position: absolute;
      right: 0.62rem;
      bottom: 0.18rem;
      left: 0.62rem;
      height: 2px;
      border-radius: 2px;
      background: var(--ses-accent);
      content: '';
      opacity: 0;
      transform: scaleX(0.4);
      transition:
        opacity var(--ses-duration) ease,
        transform var(--ses-duration) var(--ses-ease);
    }

    .desktop-nav a:hover {
      background: var(--ses-primary-soft);
      color: var(--ses-primary);
    }

    .desktop-nav a.is-active {
      color: var(--ses-primary);
    }

    .desktop-nav a.is-active::after {
      opacity: 1;
      transform: scaleX(1);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .header-cta {
      display: none;
    }

    .menu-button {
      background: var(--ses-surface);
    }

    @media (min-width: 68rem) {
      .desktop-nav {
        display: flex;
      }

      .header-cta {
        display: inline-flex;
      }

      .menu-button {
        display: none;
      }
    }

    @media (max-width: 47.99rem) {
      .topbar__levels,
      .topbar__divider,
      .topbar__admin {
        display: none;
      }

      .topbar__location {
        font-size: 0.64rem;
      }

      .header-main__inner {
        gap: 0.75rem;
      }
    }

    @media (max-width: 26rem) {
      .topbar {
        display: none;
      }

      .site-header {
        background: var(--ses-surface);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHeader {
  private readonly dialog = inject(MatDialog);

  protected readonly nav = PRIMARY_NAV;
  protected readonly site = SITE;
  protected readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  openNavigation(): void {
    this.dialog.open(MobileNavDialog, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100dvh',
      maxHeight: '100dvh',
      panelClass: 'ses-mobile-nav-panel',
      autoFocus: 'dialog',
      restoreFocus: true,
      ariaLabel: 'Site navigation',
    });
  }
}
