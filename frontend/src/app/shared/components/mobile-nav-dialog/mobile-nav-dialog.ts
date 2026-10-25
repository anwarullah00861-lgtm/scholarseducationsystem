import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PRIMARY_NAV, SITE } from '../../../core/config/site.config';
import { AppIcon } from '../app-icon/app-icon';
import { Logo } from '../logo/logo';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-mobile-nav-dialog',
  imports: [RouterLink, RouterLinkActive, AppIcon, Logo, ThemeToggle],
  template: `
    <div class="mobile-nav">
      <div class="mobile-nav__top">
        <app-logo (click)="close()" />
        <button type="button" class="icon-btn" aria-label="Close navigation" (click)="close()">
          <app-icon name="x" [size]="22" />
        </button>
      </div>

      <nav class="mobile-nav__links" aria-label="Mobile navigation">
        @for (item of nav; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
            (click)="close()"
          >
            <span class="mobile-nav__label">
              <strong>{{ item.label }}</strong>
              <small>{{ item.description }}</small>
            </span>
            <app-icon name="arrow-right" [size]="18" />
          </a>
        }
      </nav>

      <div class="mobile-nav__bottom">
        <a class="btn btn--accent" routerLink="/admissions" (click)="close()">
          Admission information
          <app-icon name="arrow-right" [size]="17" />
        </a>
        @if (site.whatsappGroupUrl) {
          <a
            class="btn btn--ghost"
            [href]="site.whatsappGroupUrl"
            target="_blank"
            rel="noopener noreferrer"
            (click)="close()"
          >
            <app-icon name="message-circle" [size]="17" />
            Join Our WhatsApp Group
          </a>
        }

        <div class="mobile-nav__meta">
          <app-icon name="map-pin" [size]="17" />
          <span>{{ site.location }}</span>
        </div>

        <div class="mobile-nav__theme">
          <span>Theme</span>
          <app-theme-toggle />
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .mobile-nav {
      display: flex;
      min-height: 100%;
      flex-direction: column;
      padding: 1.15rem 1.25rem 2rem;
      background: var(--ses-surface);
    }

    .mobile-nav__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-bottom: 1.15rem;
      border-bottom: 1px solid var(--ses-border);
    }

    .mobile-nav__links {
      display: flex;
      flex-direction: column;
      padding-block: 0.65rem;
    }

    .mobile-nav__links a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.9rem 0.15rem;
      border-bottom: 1px solid var(--ses-border);
      color: var(--ses-text);
      text-decoration: none;
    }

    .mobile-nav__links a app-icon {
      color: var(--ses-muted);
      transition: transform var(--ses-duration) var(--ses-ease);
    }

    .mobile-nav__links a:hover,
    .mobile-nav__links a.is-active {
      color: var(--ses-primary);
    }

    .mobile-nav__links a:hover app-icon,
    .mobile-nav__links a.is-active app-icon {
      color: var(--ses-primary);
      transform: translateX(3px);
    }

    .mobile-nav__label {
      display: flex;
      flex-direction: column;
      gap: 0.12rem;
    }

    .mobile-nav__label strong {
      font-size: 1rem;
      font-weight: 720;
    }

    .mobile-nav__label small {
      color: var(--ses-muted);
      font-size: var(--ses-text-xs);
      font-weight: 500;
      line-height: 1.45;
    }

    .mobile-nav__bottom {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: auto;
      padding-top: 1.5rem;
    }

    .mobile-nav__meta {
      display: flex;
      align-items: flex-start;
      gap: 0.55rem;
      color: var(--ses-muted);
      font-size: var(--ses-text-xs);
      line-height: 1.5;
    }

    .mobile-nav__meta app-icon {
      margin-top: 0.1rem;
      color: var(--ses-primary);
    }

    .mobile-nav__theme {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 0.9rem;
      border-top: 1px solid var(--ses-border);
      color: var(--ses-muted);
      font-size: var(--ses-text-sm);
      font-weight: 650;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNavDialog {
  private readonly dialogRef = inject(MatDialogRef<MobileNavDialog>);

  protected readonly nav = PRIMARY_NAV;
  protected readonly site = SITE;

  close(): void {
    this.dialogRef.close();
  }
}
